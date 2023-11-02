import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { LoadUserAccountRepository } from '../../../../src/data/contracts/repositories'
import { newDb } from 'pg-mem'

class PgAccountRepository implements LoadUserAccountRepository {
    async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {

    }
}

@Entity({ name: 'usuarios'})
export class PgUser {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    lastName: string

    @Column()
    age: number
}

describe('PG User account repo', () => {
    describe('load', () => {
        it('Should return an account if email exists', async () => {
            const db = newDb();
            const connection = await db.adapters.createTypeormConnection({
                type: 'postgres',
                entities: []
            })

            await connection.synchronize();


            const sut = new PgAccountRepository()
            const account = await sut.load({ email: 'existing_email' })
            expect(account).toEqual({
                id: '1'
            })
        })
    })
})