import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { graphqlUploadExpress } from 'graphql-upload'
import * as helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe())

  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }))

  await app.listen(8080)
}
bootstrap()
