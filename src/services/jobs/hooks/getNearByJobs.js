

export const getNearByJobs = async (context) =>
{
    const { coordinates } = context.params.query;
    delete context.params.query.coordinates;


    context.params.pipeline = [];

    if (coordinates)
    {
        const $skip = context.params.query.$skip
        const $limit = context.params.query.$limit
        const $sort = context.params.query.$sort
        delete context.params.query.$skip;
        delete context.params.query.$limit;
        delete context.params.query.$sort;
        context.params.pipeline.push(
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: coordinates
                    },
                    distanceField: "distanceInMeter",
                    // maxDistance:100000,
                    // distanceMultiplier: 6371,
                    // includeLocs: 'location',
                    spherical: true
                }
            },
            // {
            //     $match: context.params.query
            // },
            { $sort },
            { $skip },
            { $limit },
        )
        context.params.query = {};
    }
    if (context.params?.pipeline?.length <= 0)
    {
        delete context.params.pipeline
    }
    // console.log(JSON.stringify(context.params.pipeline, null, 5))
    return context;
}