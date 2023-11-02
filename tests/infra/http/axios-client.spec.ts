import { HttpGetClient } from '../../../src/infra/http/index'
import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
    async get(args: HttpGetClient.Params): Promise<void> {
        await axios.get(args.url, { params: args.params })
    }
}

describe('Axios client', () => {
    let sut: AxiosHttpClient
    let mockAxios: jest.Mocked<typeof axios>
    let url: string
    let params: object

    beforeAll(() => {
        url = 'any_url'
        mockAxios = axios as jest.Mocked<typeof axios>
        params = { any: 'any' }
    })

    beforeEach(() => {
        sut = new AxiosHttpClient()

    })

    describe('should call get with correct params', () => {
        it('', async () => {
            const sut = new AxiosHttpClient()
            await sut.get({
                url,
                params
            })
            expect(mockAxios.get).toHaveBeenCalledWith(url, {params})
            expect(mockAxios.get).toHaveBeenCalledTimes(1)
        })
    })
})