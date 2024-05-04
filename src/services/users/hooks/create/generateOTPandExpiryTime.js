import { createOTP } from "../../../../utils/createOTP.js"

export const generateOTPandExpiryTime = async (context) =>
{
    const otp = createOTP(4)
    context.data.otp = '1234' ?? `${ otp }`;
    context.data.otpexpiresat = new Date().toISOString();
    return context;
}   