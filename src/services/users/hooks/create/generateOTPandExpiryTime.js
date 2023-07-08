import { createOTP } from "../../../../utils/createOTP.js"

export const generateOTPandExpiryTime = async (context) =>
{
    const otp = createOTP(4)
    context.data.otp = `${ otp }`;
    context.data.otpexpiresat = new Date().toISOString();
    return context;
}   