import { Repository } from "typeorm"
import { PgUser } from "@/infra/postgres/entities"
import { LoadUserAccountRepository } from "@/data/contracts/repositories"

export class PgAccountRepository implements LoadUserAccountRepository {
  constructor(private readonly repository: Repository<PgUser> ) {}
  async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
     const pgUser = await this.repository.findOne({ where: { email: params.email }})
     if (pgUser) {
         return {
          id: pgUser.id.toString(),
          name: pgUser.name ?? undefined
         }
     }
  }
}