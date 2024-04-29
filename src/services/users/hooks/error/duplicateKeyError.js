export const duplicateKeyError = async (context) =>
{
    const { name, message, className, code, data } = context.error;
    if (data?.code === 11000)
    {
        const keys = Object.keys(data.keyValue);
        context.error.message = `${ keys[0] } : ${ data.keyValue[keys[0]] } is already used.`
    }
    return context;
}   