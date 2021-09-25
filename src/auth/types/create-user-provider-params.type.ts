import { Provider } from '@prisma/client'

export type CreateUserByProviderParams = {
  provider: Provider
  providerId: string
  name?: string
  email: string
  photoUrl?: string
}
