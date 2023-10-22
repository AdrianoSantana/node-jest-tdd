import { LoadFacebookUserApi } from '../../src/data/contracts/api/facebook'
import { mock, MockProxy } from 'jest-mock-extended'


class FacebookApi {
  private readonly BASE_URL: string = 'https://graph.facebook.com'
  constructor(
    private readonly httpGetClient: HttpGetClient, 
    private readonly clientId: string, 
    private readonly clientSecret: string
  ) {}
  public async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpGetClient.get({ 
      url: `${this.BASE_URL}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'cliente_credentials'
      }
    })
  }
}

interface HttpGetClient {
  get (params: HttpGetClient.Params): Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string,
    params: object
  }
}

describe('Facebook API', () => {
  let clientId: string
  let clientSecret: string
  let sut: FacebookApi
  let httpClient: MockProxy<HttpGetClient>

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    httpClient = mock<HttpGetClient>()
  })

  beforeEach(() => {
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('Should get App Token', async () => {

    const user = await sut.loadUser({ token: 'any_client_toker' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'cliente_credentials'
      }
    })
  })
})