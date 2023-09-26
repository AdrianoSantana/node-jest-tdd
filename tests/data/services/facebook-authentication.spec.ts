import { FacebookAuthenticationService } from '../../../src/data/services'
import { AuthenticationError } from '../../../src/domain/errors/authentication'
import { LoadFacebookUserApi } from '../../../src/data/contracts/api'

import { mock } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  it('should call loadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>()

    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token'})
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return an authentication error when LoadFacebookUserApi returns undefined', async() => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
