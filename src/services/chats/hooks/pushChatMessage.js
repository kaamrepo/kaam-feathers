export const pushChatMessage = async (context) => {
  const { chat_message } = context.data
  if (chat_message && Object.keys(chat_message)?.length) {
    delete context.data.chat_message
    context.data = {
      ...context.data,
      $push: { messages: chat_message }
    }
  }
  return context
}
