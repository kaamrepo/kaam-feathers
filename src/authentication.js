// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'

import { COMMON_ENDPOINT } from './constant/endpoints.js'
import { auth } from './hooks/auth.js'
import { userPath } from './services/users/users.shared.js'
import { EmailPasswordStrategy } from './authentication/email-password.strategy.js'
import { userRolesPath } from './services/user-roles/user-roles.shared.js'
export const authenticationPath = `${COMMON_ENDPOINT}authentication`

class MyAuthService extends AuthenticationService {
  async getPayload(authResult, params) {
    let payload = await super.getPayload(authResult, params)
    const { user } = authResult
    const userRole = await this.app.service(userRolesPath).find(null, { query: { userId: user._id } })
    console.log('🚀 ~ MyAuthService ~ getPayload ~ userRole:', userRole)

    if (user) {
      // payload["role"] = "admin";
      // payload["role"] = user.role;
    }
    return payload
  }
}

export const authentication = (app) => {
  const authentication = new MyAuthService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('basic', new EmailPasswordStrategy())
  authentication.register('google', new OAuthStrategy())
  authentication.register('facebook', new OAuthStrategy())
  authentication.register('twitter', new OAuthStrategy())
  authentication.register('github', new OAuthStrategy())
  authentication.register('auth0', new OAuthStrategy())

  app.use(authenticationPath, authentication)
  app.service(authenticationPath).hooks({
    before: {
      create: [auth]
    },
    after: {
      create: [
        async (context) => {
          const { strategy } = context.data
          if (strategy === 'local') {
            const { user } = context.result
            await context.app.service(userPath)._patch(user._id, {
              $unset: { otpexpiresat: '' }
            })
          }
        }
      ]
    }
  })
  app.configure(oauth())
}
