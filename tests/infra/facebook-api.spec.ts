import { FacebookApi } from '../../src/infra/api'
import { HttpGetClient } from '../../src/infra/http'
import { mock, MockProxy } from 'jest-mock-extended'  


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