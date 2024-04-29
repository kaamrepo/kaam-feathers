
import { BadRequest } from '@feathersjs/errors';
import Twilio from 'twilio';


export const sendOTP = async (context) =>
{
    const accountSid = context.app.get('kaam_twilio_account_sid');
    const authToken = context.app.get('kaam_twilio_auth_token');
    const client = new Twilio(accountSid, authToken);
    console.log(context.data.otp)
    /*try
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
    }*/
    return context
}   
