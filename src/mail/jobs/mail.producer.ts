import { ISendMailOptions } from '@nestjs-modules/mailer'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { SEND_MAIL_JOB, SEND_MAIL_QUEUE } from './constants'

@Injectable()
export class MailProducer {
  constructor(@InjectQueue(SEND_MAIL_QUEUE) private queue: Queue) {}

  async sendMail(sendMailOptions: ISendMailOptions) {
    await this.queue.add(SEND_MAIL_JOB, sendMailOptions)
  }
}
