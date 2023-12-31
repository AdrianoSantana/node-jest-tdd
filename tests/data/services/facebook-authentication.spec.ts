import { FacebookAuthenticationService } from '../../../src/data/services'
import { AuthenticationError } from '../../../src/domain/errors/authentication'
import { LoadFacebookUserApi } from '../../../src/data/contracts/api'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '../../../src/data/contracts/repositories/index'

import { mock, MockProxy } from 'jest-mock-extended'
import { FacebookAccount, AccessToken } from '../../../src/domain/models/'
import { TokenGenerator } from '../../../src/data/contracts/crypto'

jest.mock('../../../src/domain/models/facebook-accounts.ts')

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthenticationService
  let token: string

  beforeAll(() => {
    token = 'any_token'
    loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepository = mock<LoadUserAccountRepository & SaveFacebookAccountRepository>()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id'
    })  
  })
  
  beforeEach(() => {
    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')        
    sut = new FacebookAuthenticationService(loadFacebookUserApi, userAccountRepository, crypto)
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

  it('should call SaveFacebookAccountRepository with FacebookAccount', async() => {
    const facebookImplementationStub = jest.fn().mockImplementation(() => {
      return { any: 'any' }
    })
    jest.mocked(FacebookAccount).mockImplementation(facebookImplementationStub)
    
    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call tokenGenerator with correct Params', async() => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith(
      { key: 'any_account_id', expirationInMs: AccessToken.expirationInMs }
    )
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an access token with success', async() => {
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('should rethrow if load facebook throws', async() => {
    loadFacebookUserApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))
    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })


  it('should rethrow if load user throws', async() => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if save user throws', async() => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if token generator throws', async() => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})