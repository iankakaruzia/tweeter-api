import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import * as faker from 'faker'
import { User as UserModel } from '@prisma/client'
import { throwError } from '../../utils/tests/throw-error'
import {
  CLIENT_CONFIRMATION_URL,
  CLIENT_RESET_PASSWORD_URL,
  CLIENT_URL,
  mockedConfigService
} from '../../utils/tests/mocks/config.service'
import { MailProducer } from '../jobs/mail.producer'
import { MailService } from '../mail.service'

const mockMailProducer = () => ({
  sendMail: jest.fn()
})

const mockedUser = {
  email: faker.internet.email(),
  username: faker.internet.userName()
} as UserModel

describe('MailService', () => {
  let service: MailService
  let mailProducer: any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: MailProducer, useFactory: mockMailProducer }
      ]
    }).compile()

    service = module.get(MailService)
    mailProducer = module.get(MailProducer)
  })

  describe('sendForgotPasswordEmail', () => {
    it('should call MailProducer.sendMail with the correct value', async () => {
      const expectedMailOptions = {
        to: mockedUser.email,
        subject: 'Forgot your Password?',
        template: './forgot-password',
        context: {
          name: mockedUser.username,
          email: mockedUser.email,
          url: `${CLIENT_RESET_PASSWORD_URL}some_token`,
          logo: CLIENT_URL
        }
      }

      await service.sendForgotPasswordEmail(mockedUser, 'some_token')

      expect(mailProducer.sendMail).toHaveBeenCalledWith(expectedMailOptions)
    })

    it('should throw if MailProducer.sendMail throws', () => {
      mailProducer.sendMail.mockImplementationOnce(throwError)

      expect(
        service.sendForgotPasswordEmail(mockedUser, 'some_token')
      ).rejects.toThrow()
    })
  })

  describe('sendConfirmationEmail', () => {
    it('should call MailProducer.sendMail with the correct value', async () => {
      const expectedMailOptions = {
        to: mockedUser.email,
        subject: 'Tweeter - Confirm your account!',
        template: './confirmation',
        context: {
          url: `${CLIENT_CONFIRMATION_URL}some_token`,
          logo: CLIENT_URL
        }
      }

      await service.sendConfirmationEmail(mockedUser, 'some_token')

      expect(mailProducer.sendMail).toHaveBeenCalledWith(expectedMailOptions)
    })

    it('should throw if MailProducer.sendMail throws', () => {
      mailProducer.sendMail.mockImplementationOnce(throwError)

      expect(
        service.sendConfirmationEmail(mockedUser, 'some_token')
      ).rejects.toThrow()
    })
  })
})
