import { LoadFacebookUserApi } from '../../src/data/contracts/api/facebook'
import { mock, MockProxy } from 'jest-mock-extended'


class FacebookApi {
  private readonly BASE_URL: string = 'https://graph.facebook.com'
  constructor(private readonly httpGetClient: HttpGetClient) {}
  public async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpGetClient.get({ url: `${this.BASE_URL}/oauth/access_token` })
  }
}

interface HttpGetClient {
  get (params: HttpGetClient.Params): Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string
  }
}

describe('Facebook API', () => {
  it('Should get App Token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new FacebookApi(httpClient)

    const user = await sut.loadUser({ token: 'any_client_toker' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token'
    })
  })
})