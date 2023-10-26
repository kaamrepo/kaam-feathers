

export const getNearByJobs = async (context) =>
{
    const { coordinates } = context.params.query;
    delete context.params.query.coordinates;


    context.params.pipeline = [];

    if (coordinates)
    {
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
            {
                $feathers: context.params.query
            }
        )
    }
    if (context.params?.pipeline?.length <= 0)
    {
        delete context.params.pipeline
    }
    return context;
}