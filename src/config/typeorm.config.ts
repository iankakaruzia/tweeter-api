import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.MONGODB_URL || 'mongodb://localhost/tweeter',
  synchronize: true,
  useUnifiedTopology: true,
  autoLoadEntities: true
}
