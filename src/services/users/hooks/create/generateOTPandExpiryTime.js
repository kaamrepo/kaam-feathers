import { createOTP } from "../../../../utils/createOTP.js"

export const generateOTPandExpiryTime = async (context) =>
{
    const otp = createOTP(4)
    context.data.otp = `${ otp }`;
    context.data.otpExpiresAt = new Date().toISOString();
    return context;
}   