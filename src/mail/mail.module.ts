import { Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { ConfigService } from '@nestjs/config'
import { MiddlewareBuilder } from '@nestjs/core'
import { BullModule, InjectQueue } from '@nestjs/bull'
import { createBullBoard } from 'bull-board'
import { BullAdapter } from 'bull-board/bullAdapter'
import { Queue } from 'bull'
import { join } from 'path'
import { MailService } from './mail.service'
import { MailProducer } from './jobs/mail.producer'
import { MailConsumer } from './jobs/mail.consumer'
import { SEND_MAIL_QUEUE } from './jobs/constants'

@Module({
  imports: [
    BullModule.registerQueue({
      name: SEND_MAIL_QUEUE
    }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD')
          }
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [MailProducer, MailConsumer, MailService],
  exports: [MailService]
})
export class MailModule {
  constructor(@InjectQueue(SEND_MAIL_QUEUE) private sendMailQueue: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.sendMailQueue)])
    consumer.apply(router).forRoutes('/admin/queues')
  }
}
