export const CLIENT_RESET_PASSWORD_URL = 'http://test.com/reset-password'
export const CLIENT_URL = 'http://test.com'
export const CLIENT_CONFIRMATION_URL = 'http://test.com/confirm-account'

export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'CLIENT_RESET_PASSWORD_URL':
        return CLIENT_RESET_PASSWORD_URL
      case 'CLIENT_URL':
        return CLIENT_URL
      case 'CLIENT_CONFIRMATION_URL':
        return CLIENT_CONFIRMATION_URL
    }
  }
}
