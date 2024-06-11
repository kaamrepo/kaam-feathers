import { appconfigPath } from '../../../appconfig/appconfig.shared.js';
export const addDefaultValuesToUser = async (context)=>{
    // console.log("context .data in the Add Default",await context.app.service(appconfigPath).get());
    const result = await context.app.service(appconfigPath).find({});
    console.log(":result",result?.data[0]);
    context.data.allowedjobapplication = result?.data[0]?.allowedjobapplication || 1
    context.data.allowedjobposting = result?.data[0]?.allowedjobposting || 1
    console.log("context.data",context.data);
}