import { FacebookAuthenticationService } from '../../../src/data/services'
import { AuthenticationError } from '../../../src/domain/errors/authentication'
import { LoadFacebookUserApi } from '../../../src/data/contracts/api'
import { LoadUserAccountRepository } from '../../../src/data/contracts/repositories/index'
import { CreateFacebookAccountRepository } from '../../../src/data/contracts/repositories/index'


import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>

  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    loadUserAccountRepository = mock<LoadUserAccountRepository>()
    createFacebookAccountRepository = mock<CreateFacebookAccountRepository>()

    
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepository, createFacebookAccountRepository)
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

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call createFacebookAccountRepository when LoadUserAccountRepository returns undefined', async() => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })

    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledWith({ 
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id' 
    })
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
