import { IMemoryDb, newDb } from "pg-mem";
import { DataSource } from "typeorm";

export const makeFakeDb = async (): Promise<IMemoryDb> => {
  const db = newDb({
      autoCreateForeignKeyIndices: true
  })
   
  db.public.registerFunction({
      implementation: () => 'test',
      name: 'current_database',
  });

  db.public.registerFunction({
      implementation: () => 'test',
      name: 'version',
  })
  return db
}

export const makeFakeDataSource = async (db: IMemoryDb): Promise<DataSource>  => {
    const dataSource = await db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: ['src/infra/postgres/entities/index.ts']
    })
        
    await dataSource.initialize()
    await dataSource.synchronize()
    return dataSource
}
