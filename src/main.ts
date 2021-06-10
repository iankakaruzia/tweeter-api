import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { graphqlUploadExpress } from 'graphql-upload'
import * as helmet from 'helmet'
import * as basicAuth from 'express-basic-auth'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

const configService = new ConfigService()

async function bootstrap() {
  const BULL_UI_USERNAME = configService.get<string>('BULL_UI_USERNAME')
  const BULL_UI_PASSWORD = configService.get<string>('BULL_UI_PASSWORD')

  const app = await NestFactory.create(AppModule)

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false
    })
  )

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe())

  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }))

  app.use(
    '/admin/queues',
    basicAuth({
      users: {
        [BULL_UI_USERNAME]: BULL_UI_PASSWORD
      },
      challenge: true
    })
  )

  await app.listen(process.env.PORT || 8080)
}

bootstrap()
