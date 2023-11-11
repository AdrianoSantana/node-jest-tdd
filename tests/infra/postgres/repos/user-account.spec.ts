import { DataSource, Repository } from 'typeorm'
import { LoadUserAccountRepository } from '@/data/contracts/repositories'
import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { PgUser } from '@/infra/postgres/entities'
import { PgAccountRepository } from '@/infra/postgres/repositories'
import { makeFakeDataSource, makeFakeDb } from '../mocks/connection'


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