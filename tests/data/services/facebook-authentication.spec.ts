import { FacebookAuthentication } from '../../../src/domain/features'

class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi) {
  }

  async perform(params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
  }
}

interface LoadFacebookUserApi {
  loadUser(params: LoadFacebookUserApi.Params): Promise<void>
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call loadFacebookUserApi with correct params', async () => {
    const loadFacebookUserByTokenApi = new LoadFacebookUserApiSpy()

    const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserByTokenApi.token).toBe('any_token')
  })
})
