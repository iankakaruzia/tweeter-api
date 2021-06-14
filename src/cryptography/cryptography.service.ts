import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class CryptographyService {
  async hash(plaintext: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return bcrypt.hash(plaintext, salt)
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest)
  }
}
