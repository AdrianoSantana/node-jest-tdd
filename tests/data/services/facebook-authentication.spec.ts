import { FacebookAuthenticationService } from '../../../src/data/services'
import { AuthenticationError } from '../../../src/domain/errors/authentication'
import { LoadFacebookUserApi } from '../../../src/data/contracts/api'
import { LoadUserAccountRepository } from '../../../src/data/contracts/repositories/index'
import { CreateFacebookAccountRepository } from '../../../src/data/contracts/repositories/index'


import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository>

  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepository = mock<LoadUserAccountRepository & CreateFacebookAccountRepository>()
    
    sut = new FacebookAuthenticationService(loadFacebookUserApi, userAccountRepository)
  })

  it('should call loadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token})
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return an authentication error when LoadFacebookUserApi returns undefined', async() => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFaceBookUserApi returns data', async() => {
    await sut.perform({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call createFacebookAccountRepository when LoadUserAccountRepository returns undefined', async() => {
    userAccountRepository.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({ 
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id' 
    })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
