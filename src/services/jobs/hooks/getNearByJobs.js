export const getNearByJobs = async (context) => {
  const { query } = context.params;
  console.log("entered in the hook");

  switch (query.type) {
    case 'nearby':
      console.log('nearby query', query);
      const { coordinates } = context.params.query;
      delete context.params.query.coordinates;
      context.params.pipeline = [];
        // Add search text logic if query.text is present
        if (query.text) {
          context.params.pipeline.push({
            $match: {
              $text: {
                $search: query.text,
                $caseSensitive: false,
              }
            }
          });
        }

      if (coordinates) {
        context.params.pipeline.push({
          $geoNear: {
            near: {
              type: "Point",
              coordinates: coordinates
            },
            distanceField: "distanceInMeter",
            spherical: true
          }
        });
      }

      context.params.pipeline.push({
        $feathers: context.params.query
      });

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
