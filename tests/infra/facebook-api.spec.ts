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
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id'}})
      .mockResolvedValueOnce({ id: 'any_fb_id', email: 'any_fb_email', name: 'any_fb_name' })

    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('Should get App Token', async () => {

    const user = await sut.loadUser({ token: 'any_client_token' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'cliente_credentials'
      }
    })
  })

  it('Should get Debug Token', async () => {
    await sut.loadUser({ token: 'any_client_token' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token',
      }
    })
  })

  it('Should get user info', async () => {
    await sut.loadUser({ token: 'any_client_token' })
    
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token',
      }
    })
  })

  it('Should return Facebook load user result', async () => {
    const result = await sut.loadUser({ token: 'any_client_token' })
    expect(result).toEqual({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
    
  })
})