import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { SEND_MAIL_JOB, SEND_MAIL_QUEUE } from './constants'

@Processor(SEND_MAIL_QUEUE)
export class MailConsumer {
  constructor(private mailerService: MailerService) {}

  @Process(SEND_MAIL_JOB)
  async sendMailJob(job: Job<ISendMailOptions>) {
    const { data } = job

    await this.mailerService.sendMail(data)
  }
}
