import { FacebookAccount } from '../../src/domain/models/facebook-accounts'
import { AccessToken } from "../../src/domain/models"

describe('Access Token', () => {

  it('should create with a value', () => {
    const sut = new AccessToken('any_value')
    expect(sut).toEqual({ value: 'any_value'})
  })

  it('should expire in 1800000ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})