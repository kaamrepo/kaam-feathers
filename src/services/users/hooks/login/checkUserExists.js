import { NotFound } from "@feathersjs/errors";
import { userPath } from "../../users.shared.js"


export const checkUserExists = async (context) =>
{
    const { phone } = context.data
    if (phone)
    {
        const user = await context.app.service(userPath).getByPhone(context.data.phone);
        if (!user)
        {
            throw new NotFound("User does not exists");
        }
        context.id = user._id
    }
    return context;
}