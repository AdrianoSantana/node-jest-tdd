import { HttpGetClient } from '../../../src/infra/http/index'
import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
    async get(args: HttpGetClient.Params): Promise<void> {
        await axios.get(args.url, { params: args.params })
    }
}

describe('Axios client', () => {
    describe('should call get with correct params', () => {
        it('', async () => {
            const mockAxios = axios as jest.Mocked<typeof axios>
            const sut = new AxiosHttpClient()
            await sut.get({
                url: 'any_url',
                params: {
                    any: 'any'
                }
            })
            expect(mockAxios.get).toHaveBeenCalledWith('any_url', {
                params: {
                    any: 'any'
                }
            })
            expect(mockAxios.get).toHaveBeenCalledTimes(1)
        })
    })
})