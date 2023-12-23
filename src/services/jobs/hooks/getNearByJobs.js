export const getNearByJobs = async (context) => {
  const { query } = context.params;
  console.log("entered in the hook");

  switch (query.type) {
    case 'nearby':
      const { coordinates,text } = context.params.query;
      delete context.params.query.coordinates;
      delete context.params.query.text;
      delete context.params.query.type;
      context.params.pipeline = [];

      // if (coordinates) {
      //   context.params.pipeline.push({
      //     $geoNear: {
      //       near: {
      //         type: "Point",
      //         coordinates: coordinates
      //       },
      //       distanceField: "distanceInMeter",
      //       spherical: true,
      //       maxDistance: 100000, // Set the maximum distance in meters (100km)
      //     }
      //   });
      // }

      if (text) {
        const textSearchCondition = {
          $or: [
            // Case-insensitive text search condition
            { position: { $regex: text, $options: 'i' } },
            { requirements: { $regex: text, $options: 'i' } },
            { description: { $regex: text, $options: 'i' } },
            // Add other fields as needed for text search
          ],
        };

        context.params.pipeline.push({
          $match: textSearchCondition,
        });
      }
      context.params.pipeline.push({
        $feathers: context.params.query
      });
  console.log("context.params.pipeline",JSON.stringify(context.params.pipeline,null,4));
      if (context.params?.pipeline?.length <= 0) {
        delete context.params.pipeline;
      }
      break;

    case 'recommended':
      console.log('recommended query', query);
      break;

    case 'featured':
      console.log('featured query', query);
      break;

    default:
      console.log('default', query);
      break;
  }

  delete query.type;

  return context;
};
