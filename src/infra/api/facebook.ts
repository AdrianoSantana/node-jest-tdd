import { LoadFacebookUserApi } from "@/data/contracts/api"
import { HttpGetClient } from "@/infra/http"

export class FacebookApi {
  private readonly BASE_URL: string = 'https://graph.facebook.com'
  constructor(
    private readonly httpGetClient: HttpGetClient, 
    private readonly clientId: string, 
    private readonly clientSecret: string
  ) {}
  public async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpGetClient.get({ 
      url: `${this.BASE_URL}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'cliente_credentials'
      }
    })
  }
}