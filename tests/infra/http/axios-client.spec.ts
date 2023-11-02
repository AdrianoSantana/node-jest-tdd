import { HttpGetClient } from '../../../src/infra/http/index'
import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
    async get(args: HttpGetClient.Params): Promise<any> {
        const result = await axios.get(args.url, { params: args.params })
        return result.data
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
        mockAxios.get.mockResolvedValue({
            status: 200,
            data: 'any_data'
        })
        params = { any: 'any' }
    })

    beforeEach(() => {
        sut = new AxiosHttpClient()

    })

    describe('get', () => {
        it('should call get with correct params', async () => {
            const sut = new AxiosHttpClient()
            await sut.get({
                url,
                params
            })
            expect(mockAxios.get).toHaveBeenCalledWith(url, {params})
            expect(mockAxios.get).toHaveBeenCalledTimes(1)
        })

        it('should return data on success', async () => {
            const sut = new AxiosHttpClient()
            const result = await sut.get({
                url,
                params
            })
            expect(result).toEqual('any_data')
        })

        it('should rethrow if get throws', async () => {
            mockAxios.get.mockRejectedValueOnce(new Error('http_error'))
            const sut = new AxiosHttpClient()
            const promise = sut.get({
                url,
                params
            })
            await expect(promise).rejects.toThrow(new Error('http_error'))
        })
    })
})