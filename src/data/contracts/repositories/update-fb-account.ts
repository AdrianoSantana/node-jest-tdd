export interface UpdateFacebookAccountRepository {
  updateWithFacebook(params: UpdateFacebookAccountRepository.Params): Promise<void>
}

export namespace UpdateFacebookAccountRepository {
  export type Params = {
    id: string
    name: string
    facebookId: string
  }

  export type Result = undefined

}