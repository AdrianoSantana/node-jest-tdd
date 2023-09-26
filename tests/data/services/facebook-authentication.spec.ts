import { FacebookAuthenticationService } from '../../../src/data/services'
import { AuthenticationError } from '../../../src/domain/errors/authentication'
import { LoadFacebookUserApi } from '../../../src/data/contracts/api'
    
class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined
  async loadUser(params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call loadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()

    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
  })

  it('should return an authentication error when LoadFacebookUserApi returns undefined', async() => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined

    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
