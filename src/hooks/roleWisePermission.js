import { Forbidden } from "@feathersjs/errors"
import { messages } from "../assets/messages.js"
import { logger } from "../logger.js";
const sysytemRoles = ["admin", "user", "moderator"];

export const roleWisePermission = (permission) => async (context) =>
{
    const { user } = context.params;
    if (user && !sysytemRoles.includes(user.role))
    {
        throw new Forbidden(messages.authorization.unauthorized);
    }

    const { allow, deny } = permission;
    const duplicateRole = allow?.find(role => deny?.includes(role));

    if (duplicateRole)
    {
        logger.warn(`Role '${ duplicateRole }' is present in both allow and deny arrays.`)
    }

    if (user && allow?.includes(user?.role))
    {
        if (user?.role === "user")
        {
            if (!user.isActive && !user.isBlocked && !user.isDeleted)
            {
                throw new Forbidden("Your account has been deactivated")
            }
            if (!user.isActive && user.isBlocked && !user.isDeleted)
            {
                throw new Forbidden("Your account has been blocked")
            }
            if (!user.isActive && !user.isBlocked && user.isDeleted)
            {
                throw new Forbidden(messages.authentication.user.deleted)
            }
            if (!user.isActive && user.isBlocked && user.isDeleted)
            {
                throw new Forbidden(messages.authentication.user.deleted)
            }
        }
        return context;
    }
    if (user && (deny?.includes(user?.role) || !allow?.includes(user?.role)))
    {
        throw new Forbidden(messages.authorization.unauthorized);
    }
    return context;
}
