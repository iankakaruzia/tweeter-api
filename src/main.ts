import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { graphqlUploadExpress } from 'graphql-upload'
import * as helmet from 'helmet'
import * as basicAuth from 'express-basic-auth'
import { ConfigService } from '@nestjs/config'
import * as Sentry from '@sentry/node'
import { AppModule } from './app.module'

const configService = new ConfigService()

async function bootstrap() {
  const BULL_UI_USERNAME = configService.get('BULL_UI_USERNAME')
  const BULL_UI_PASSWORD = configService.get('BULL_UI_PASSWORD')
  const SENTRY_DNS = configService.get('SENTRY_DNS')
  const SENTRY_TRACES_SAMPLE_RATE = configService.get(
    'SENTRY_TRACES_SAMPLE_RATE'
  )
  const PORT = configService.get('PORT')

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

  Sentry.init({
    dsn: SENTRY_DNS,
    tracesSampleRate: Number(SENTRY_TRACES_SAMPLE_RATE)
  })

  await app.listen(PORT || 8080)
}

bootstrap()
