import { LocalStrategy } from '@feathersjs/authentication-local'
import { userPath } from '../services/users/users.shared.js'
import { BadRequest, NotAuthenticated } from '@feathersjs/errors'

export class EmailPasswordStrategy extends LocalStrategy {
  async comparePassword(entity, password) {
    await super.comparePassword(entity, password)
  }
  async authenticate(authentication) {
    const { email, password, strategy } = authentication
    if (!email || !password) {
      throw new BadRequest('Invalid email or password provided.')
    }

    const entity = await this.app.service(userPath).find({ query: { email } })

    if (!entity.total) {
      throw new NotAuthenticated('Invalid email or password provided.')
    }

    const user = entity.data.at(0)

    if (!user) {
      throw new NotAuthenticated('Invalid email or password provided.')
    }
    try {
      await this.comparePassword(user, password)
    } catch (error) {
      throw new NotAuthenticated('Invalid email or password provided.')
    }

    return {
      authentication: {
        strategy
      },
      user
    }
  }
}
// export class EmailPasswordStrategy extends AuthenticationBaseStrategy {
//   async authenticate(authentication, params) {
//     // console.log('🚀 ~ BasicStrategy ~ authenticate ~ authentication, params:', authentication, params)
//     const { email, password } = authentication
//     if (!email || !password) {
//       throw new BadRequest('No email or password provided.')
//     }

//     const entity = await this.app.service(userPath).find({ query: { email } })

//     if (!entity.total) {
//       throw new NotAuthenticated('Invalid login')
//     }

//     const user = entity.data.at(0)

//     if (!user) {
//       throw new NotAuthenticated('Invalid login')
//     }

//     return { user }
//   }
// }
