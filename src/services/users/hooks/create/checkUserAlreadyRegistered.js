import { BadRequest } from "@feathersjs/errors";
import { userPath } from "../../users.shared.js"


export const checkUserAlreadyRegistered = async (context) =>
{
    const { phone } = context.data
    if (phone)
    {
        const user = await context.app.service(userPath).getByPhone(context.data.phone);
        if (user)
        {
            throw new BadRequest("User already exists");
        }
    }
    return context;
}