import { Test, TestingModule } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'

import { CryptographyService } from '../cryptography.service'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash'
  },
  async compare(): Promise<boolean> {
    return true
  }
}))

describe('CryptographyService', () => {
  let service: CryptographyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptographyService]
    }).compile()

    service = module.get<CryptographyService>(CryptographyService)
  })

  describe('hash', () => {
    it('should call Bcrypt hash with the correct value', async () => {
      const plaintext = 'some_text'
      const salt = 12
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await service.hash(plaintext)

      expect(hashSpy).toBeCalledWith(plaintext, salt)
    })

    it('should return a valid hash on success', async () => {
      const plaintext = 'some_text'
      const hashedText = await service.hash(plaintext)

      expect(hashedText).toBe('hash')
    })

    it('should throw if hash throws', async () => {
      const plaintext = 'some_text'
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = service.hash(plaintext)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare', () => {
    it('should call Bcrypt compare with the correct values', async () => {
      const plaintext = 'some_text'
      const digest = 'some_hashed_text'
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await service.compare(plaintext, digest)

      expect(compareSpy).toBeCalledWith(plaintext, digest)
    })

    it('should return true when the validation succeeds', async () => {
      const plaintext = 'some_text'
      const digest = 'some_hashed_text'
      const isValid = await service.compare(plaintext, digest)

      expect(isValid).toBe(true)
    })

    it('should throw if compare throws', async () => {
      const plaintext = 'some_text'
      const digest = 'some_hashed_text'
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = service.compare(plaintext, digest)

      await expect(promise).rejects.toThrow()
    })
  })
})
