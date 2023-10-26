import { app } from "../app.js";

export const createOTP = (length) =>
{
    if (length)
    {
        const min = 10 ** (length - 1); // Minimum value for n length
        const max = 10 ** length - 1; // Maximum value for n length
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    else
    {
        const min = 10 ** ((process.env.KAAM_OTP_DIGITS) || 6) - 1; // Minimum value for n length
        const max = 10 ** ((process.env.KAAM_OTP_DIGITS) || 6) - 1; // Maximum value for n length
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
