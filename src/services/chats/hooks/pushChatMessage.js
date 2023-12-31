import { ObjectId } from 'mongodb'

export const pushChatMessage = async (context) => {
  const chat_message = context.data
  if (chat_message && Object.keys(chat_message)?.length) {
    context.data = {
      $push: {
        messages: {
          _id: new ObjectId(),
          senderid: context.params.user._id,
          ...chat_message
        }
      }
    }
  }
  return context
}
