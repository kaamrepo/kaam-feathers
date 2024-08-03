import { appconfigPath } from '../../../appconfig/appconfig.shared.js'
export const addDefaultValuesToUser = async (context) => {
  const result = await context.app.service(appconfigPath).find({})
  context.data.allowedjobapplication = result?.data[0]?.allowedjobapplication || 1
  context.data.allowedjobposting = result?.data[0]?.allowedjobposting || 1
}
