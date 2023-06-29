
export const getDateWithStartTime = (date) =>
{
    const now = new Date(date).getTime();
    return new Date(now - (now % 86400000));
}
export const getDateWithEndTime = (date) =>
{
    const now = new Date(date).getTime();
    return new Date(now - (now % 86400000) + 86399999);
}
