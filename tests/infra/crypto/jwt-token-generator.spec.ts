import jwt from 'jsonwebtoken'
import { TokenGenerator } from '../../../src/data/contracts/crypto/index'

jest.mock('jsonwebtoken')

class JwtTokenGenerator {
    constructor(private readonly secret: string) {}
    async generateToken(params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
        const expirationInSeconds: number = params.expirationInMs / 1000
        jwt.sign({ key: params.key}, this.secret, { expiresIn: expirationInSeconds })
        return ''
    }
}
describe('JWT token generator', () => {
    it('Should call sign with correct params', async () => {
        const fakeJwt = jwt as jest.Mocked<typeof jwt>
        const sutt = new JwtTokenGenerator('any_secret')
        await sutt.generateToken({
            key: 'any_key',
            expirationInMs: 1000
        })

        expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
        expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })
})