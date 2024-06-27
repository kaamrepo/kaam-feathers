import { jobapplicationPath } from "../../../jobapplications/jobapplications.shared.js";
import { jobPath } from "../../../jobs/jobs.shared.js";
import { userPath } from "../../users.shared.js";
import { BadRequest } from '@feathersjs/errors';

export const analytics = () => async (context) => {
  if (context?.params?.query?.analytics) {
    try {
      // Access the FeathersJS service to get the model
      const jobApplicationModel = await context.app.service(jobapplicationPath)?.getModel();
      const jobModel = await context.app.service(jobPath)?.getModel();
      const userModel = await context.app.service(userPath)?.getModel();

      const pipeline = [
        {
          $match: {
            status: { $in: ['Approved', 'Completed'] }
          }
        },
      ];

      // Execute aggregation pipeline
      const jobapplicaitonCount = await jobApplicationModel.aggregate(pipeline).toArray();

      // Attach result to context
      context.result = jobapplicaitonCount;

      // Remove the analytics query parameter
      delete context.params.query.analytics;

    } catch (error) {
      console.error('Error performing analytics:', error);
      throw new BadRequest('Failed to retrieve analytics data.');
    }
  }

  return context;
};
