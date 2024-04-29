import { NotFound } from '@feathersjs/errors'
import { chatPath } from '../../chats/chats.shared.js'
import { userPath } from '../../users/users.shared.js'
import { ObjectId } from 'mongodb'

export const createChatForAppliedJob = async (context) => {
  const { result } = context
  if (result?._id) {

    const user = await context.app.service(userPath).get(result?.appliedby)

    if (user?._id) {
      const chatService = context.app.service(chatPath)
      const { firstname, lastname } = user
      let payload = {
        applicationid: result?._id,
        messages: [
          {
            _id: new ObjectId(),
            messageType: 'initial',
            senderid: user?._id,
            text: `${firstname} ${lastname} has applied for the job`,
            createdat: new Date().toISOString(),
            isseen: false
          }
        ]
      }
      await chatService.create(payload)
    } else {
      throw new NotFound('User not found!')
    }
  }
  return context
}
