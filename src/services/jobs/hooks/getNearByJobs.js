

export const getNearByJobs = async (context) =>
{
    const { query } = context.params;

    // Access the salary parameter
    const salary = query.salary;

    console.log('Salary:', salary);

    console.log("context.path:", context.path);
    console.log("context.method:", context.method);
    console.log("context.id:", context.id);
    console.log("context.type:", context.type);
    console.log("context.params.query:", context.params.query);
    console.log("context.params.route:", context.params.route);
    console.log("context.params.headers:", context.params.headers);
    console.log("context.params.provider:", context.params.provider);
    console.log("context.params.user:", context.params.user);
    console.log("context.result:", context.result);
    console.log("context.error:", context.error);
    console.log("context.dispatch:", context.dispatch);
    // const { coordinates } = context.params.query;
    // delete context.params.query.coordinates;
    

    // context.params.pipeline = [];

    // if (coordinates)
    // {
    //     context.params.pipeline.push(
    //         {
    //             $geoNear: {
    //                 near: {
    //                     type: "Point",
    //                     coordinates: coordinates
    //                 },
    //                 distanceField: "distanceInMeter",
    //                 // maxDistance:100000,
    //                 // distanceMultiplier: 6371,
    //                 // includeLocs: 'location',
    //                 spherical: true
    //             }
    //         },
            // {
            //     $feathers: context.params.query
            // }
    //     )
    // }
    // if (context.params?.pipeline?.length <= 0)
    // {
    //     delete context.params.pipeline
    // }
    
    return context;
}