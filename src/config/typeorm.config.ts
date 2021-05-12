import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: 'mongodb://localhost/tweeter',
  synchronize: true,
  useUnifiedTopology: true,
  autoLoadEntities: true
}
