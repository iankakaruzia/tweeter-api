import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import * as helmet from 'helmet'
import * as basicAuth from 'express-basic-auth'
import * as Sentry from '@sentry/node'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { PrismaService } from './prisma/prisma.service'

const configService = new ConfigService()

async function bootstrap() {
  const BULL_UI_USERNAME = configService.get('BULL_UI_USERNAME')
  const BULL_UI_PASSWORD = configService.get('BULL_UI_PASSWORD')
  const SENTRY_DNS = configService.get('SENTRY_DNS')
  const SENTRY_TRACES_SAMPLE_RATE = configService.get(
    'SENTRY_TRACES_SAMPLE_RATE'
  )
  const PORT = configService.get('PORT')
  const SESSION_SECRET = configService.get('SESSION_SECRET')

  const app = await NestFactory.create(AppModule)

  Sentry.init({
    dsn: SENTRY_DNS,
    tracesSampleRate: Number(SENTRY_TRACES_SAMPLE_RATE)
  })

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false
    })
  )

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  })

  app.use(cookieParser())
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    })
  )
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useGlobalFilters(new AllExceptionsFilter())

  app.use(
    '/admin/queues',
    basicAuth({
      users: {
        [BULL_UI_USERNAME]: BULL_UI_PASSWORD
      },
      challenge: true
    })
  )

  const prismaService: PrismaService = app.get(PrismaService)
  prismaService.enableShutdownHooks(app)

  await app.listen(PORT || 8080)
}

bootstrap()
