import { Provider } from '../enums/provider.enum'

export type CreateUserByProviderParams = {
  provider: Provider
  providerId: string
  name?: string
  email: string
  photoUrl?: string
}
