import { LoadFacebookUserApi } from "@/data/contracts/api"
import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from "../contracts/repositories"

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {
  }

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
    if (fbData !== undefined) {
      await this.loadUserAccountRepository.load({ email:  fbData.email })
      await this.createFacebookAccountRepository.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}