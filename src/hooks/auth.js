import { userPath } from "../services/users/users.shared.js";
import { Forbidden, GeneralError, NotFound } from '@feathersjs/errors';

export const auth = async (context) =>
{
    const [auth, rest] = context.arguments

    const user = await context.app.service(userPath).getByPhone(auth.phone)

    const date = new Date(auth.date);
    if (user)
    {
        if (!user.otpexpiresat)
        {
            throw new NotFound("User doesn't exits.");
        }
    
        const expiryTime = Number(process.env.KAAM_OTP_VALIDITY_TIME) ?? 4
        const otpCreatedTime = new Date(new Date(user?.otpexpiresat).getTime() - expiryTime * 60000)
        const isValid = otpCreatedTime <= date && date <= user.otpexpiresat;
        if (!isValid)
        {
            throw new GeneralError("OTP has expired!")
        }
    }
    return context;
}