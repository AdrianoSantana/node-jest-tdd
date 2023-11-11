import { DataSource, Repository } from 'typeorm'
import { LoadUserAccountRepository } from '@/data/contracts/repositories'
import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { PgUser } from '@/infra/postgres/entities'
import { PgAccountRepository } from '@/infra/postgres/repositories'

const makeFakeDb = async (): Promise<IMemoryDb> => {
    const db = newDb({
        autoCreateForeignKeyIndices: true
    })
     
    db.public.registerFunction({
        implementation: () => 'test',
        name: 'current_database',
    });

    db.public.registerFunction({
        implementation: () => 'test',
        name: 'version',
    })
    return db
}

const makeFakeDataSource = async (db: IMemoryDb): Promise<DataSource>  => {
    const dataSource = await db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: ['src/infra/postgres/entities/index.ts']
    })
        
    await dataSource.initialize()
    await dataSource.synchronize()
    return dataSource
}

describe('PG User account repo', () => {
    describe('load', () => {
        let sut: LoadUserAccountRepository
        let pgUserRepository: Repository<PgUser>
        let dataSource: DataSource
        let backup: IBackup
        
        beforeAll(async () => {
            const db  = await makeFakeDb()
            dataSource = await makeFakeDataSource(db)
            pgUserRepository = dataSource.getRepository(PgUser)
            backup = db.backup()
        })
    
        beforeEach(() => {
            backup.restore()
            sut = new PgAccountRepository(pgUserRepository)
        })
    
        afterAll(async () => {
            await dataSource.destroy()
        })

        it('Should return an account if email exists', async () => {
            await pgUserRepository.save({ email: 'existing_email' })
            const account = await sut.load({ email: 'existing_email' })
            expect(account).toEqual({
                id: '1'
            })
        })

        it('Should return undefined if email does not exist', async () => {
            const account = await sut.load({ email: 'existing_email' })
            expect(account).toEqual(undefined)
        })
  
    })
})