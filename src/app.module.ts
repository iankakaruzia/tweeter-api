import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { UsersModule } from './users/users.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    CryptographyModule,
    AuthModule
  ]
})
export class AppModule {}
