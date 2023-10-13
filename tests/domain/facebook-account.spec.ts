import { FacebookAccount } from '../../src/domain/models/facebook-accounts'

describe('', () => {
  const fbData = {
    name: 'any_fb_name',
    email: 'any_email',
    facebookId: 'any_fb_id'
  }

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(fbData)

    expect(sut).toEqual({
      name: 'any_fb_name',
      email: 'any_email',
      facebookId: 'any_fb_id'
    })
  })

  it('should update name if its empty', () => {
    const accountData = { id: 'any_id' }
    const sut = new FacebookAccount(fbData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_email',
      facebookId: 'any_fb_id'
    })
  })

  it('should not update name if it is not empty', () => {
    const accountData = { id: 'any_id', name: 'any_name' }
    const sut = new FacebookAccount(fbData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      facebookId: 'any_fb_id'
    })
  })
})