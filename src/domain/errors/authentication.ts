export class AuthenticationError extends Error {
  constructor() {
    super('Authentication Fails')
    this.name = 'AuthenticationError'
  }
}