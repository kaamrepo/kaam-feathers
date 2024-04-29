
export const commonHook = async (context) =>
{
    let query = context.params.query;
    if (query && query !== undefined)
    {
        query["$sort"] = (!query.sortAsc && !query.sortDesc) ? { createdat: -1 } : {}
        Object.keys(context.params.query).forEach((key) =>
        {
            switch (key)
            {
                case "select":
                    query["$select"] = Array.isArray(query["select"]) ? query["select"] : [query["select"]];
                    delete query.select;
                    break;
                case "limit":
                    query["$limit"] = Number(query["limit"]);
                    delete query["limit"];
                    break;
                case "skip":
                    query["$skip"] = Number(query["skip"]);
                    delete query["skip"];
                    break;
                case "sortDesc":
                    Array.isArray(query["sortDesc"]) ? query["sortDesc"].forEach(field =>
                    {
                        query.$sort[`${ field }`] = -1;
                    }) : (() =>
                    {
                        query["$sort"] = { ...query["$sort"] };
                        query.$sort[`${ query.sortDesc }`] = -1;
                    })()

                    delete query["sortDesc"];
                    break;
                case "sortAsc":
                    Array.isArray(query["sortAsc"]) ? query["sortAsc"].forEach(field =>
                    {
                        query.$sort[`${ field }`] = 1;
                    }) : (() =>
                    {
                        query["$sort"] = { ...query["$sort"] };
                        query.$sort[`${ query.sortAsc }`] = 1;
                    })()

                    delete query["sortAsc"];
                    break;

                case 'paginate':

                    if (query['paginate'] == "false")
                    {
                        context.params.paginate = false
                    }
                    else if (query['paginate'] === false)
                    {
                        context.params.paginate = false
                    }
                    else { }
                    delete context.params.query['paginate']
                default:
                    break;
            }
        });
        context.params.query = query;
    }
    return context;
};