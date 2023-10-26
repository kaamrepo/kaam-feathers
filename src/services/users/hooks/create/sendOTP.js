
import { BadRequest } from '@feathersjs/errors';
import Twilio from 'twilio';


export const sendOTP = async (context) =>
{
    const accountSid = process.env.KAAM_TWILIO_ACCOUNT_SID;
    const authToken = process.env.KAAM_TWILIO_AUTH_TOKEN;
    const client = new Twilio(accountSid, authToken);
    console.log(context.data.otp)
    try
    {
        const message = await client.messages.create({
            body: `${ context.data.otp } is your Verification Code.`,
            from: '+13614365406',
            to: `${ context.data.dialcode }${ context.data.phone }`
        });
        console.log(message.sid);
    } catch (error)
    {
        console.log(JSON.stringify(error, null, 4));
        throw new BadRequest(error.message)
    }
    return context
}   