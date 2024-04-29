import { jobapplicationPath } from '../../jobapplications/jobapplications.shared.js'

export const updateChatIdInJobApplication = async (context) => {

  const { _id, applicationid } = context.result

  if (_id && applicationid) {
    await context.app.service(jobapplicationPath)._patch(applicationid, {
      chatid: _id
    })
  }
  return context
}
