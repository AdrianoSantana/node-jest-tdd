import { LoadFacebookUserApi } from "@/data/contracts/api"
import { HttpGetClient } from "@/infra/http"

export class FacebookApi implements LoadFacebookUserApi {
  private readonly BASE_URL: string = 'https://graph.facebook.com'
  constructor(
    private readonly httpGetClient: HttpGetClient, 
    private readonly clientId: string, 
    private readonly clientSecret: string
  ) {}
  public async loadUser(params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const userInfo = await this.getUserInfo(params.token)

    return {
      email: userInfo.email,
      name: userInfo.name,
      facebookId: userInfo.id
    }
  }

  private async getAppToken(): Promise<AppToken> {
    return await this.httpGetClient.get<AppToken>({ 
      url: `${this.BASE_URL}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'cliente_credentials'
      }
    })
  }

  private async getDebugToken(clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()

    return await this.httpGetClient.get<DebugToken>({
      url: `${this.BASE_URL}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo(clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken)

    return await this.httpGetClient.get<UserInfo>({
      url: `${this.BASE_URL}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

type UserInfo = {
  id: string
  name: string
  email: string
}