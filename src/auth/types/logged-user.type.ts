type LoggedUserType = {
  email: string
  username: string
  name?: string
  profilePhoto?: string
}

export type LoginReturnType = {
  user: LoggedUserType
}
