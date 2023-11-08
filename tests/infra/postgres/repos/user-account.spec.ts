import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm'
import { LoadUserAccountRepository } from '../../../../src/data/contracts/repositories'
import { newDb } from 'pg-mem'

class PgAccountRepository implements LoadUserAccountRepository {
    constructor(private readonly repository: Repository<PgUser> ) {}
    async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
       const pgUser = await this.repository.findOne({ where: { email: params.email }})
       if (pgUser) {
           return {
            id: pgUser.id.toString(),
            name: pgUser.name ?? undefined
           }
       }
    }
}

@Entity({ name: 'usuarios'})
export class PgUser {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({  nullable: true, name: 'nome'})
    name?: string

    @Column()
    email!: string

    @Column({ nullable: true, name: 'id_facebook'})
    facebookId?: string
}

describe('PG User account repo', () => {
    describe('load', () => {
        it('Should return an account if email exists', async () => {
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
             
            const dataSource: DataSource = await db.adapters.createTypeormDataSource({
                type: 'postgres',
                entities: [PgUser]
            })

            await dataSource.initialize()
            await dataSource.synchronize()

            const pgUserRepository = dataSource.getRepository(PgUser)
            await pgUserRepository.save({ email: 'existing_email' })


            const sut = new PgAccountRepository(pgUserRepository)
            const account = await sut.load({ email: 'existing_email' })
            expect(account).toEqual({
                id: '1'
            })
        })
    })
})