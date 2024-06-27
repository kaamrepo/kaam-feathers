// src/services/analytics/analytics.class.js
import { jobPath } from "../jobs/jobs.shared.js";
import { jobapplicationPath } from "../jobapplications/jobapplications.shared.js";
import { userPath } from "../users/users.shared.js";
export class AnalyticsService {
  constructor(options) {
    this.options = options
    this.app = options.app;
  }

  async find(_params) {
    const jobsService = this.app.service(jobPath);
    const jobApplicationsService = this.app.service(jobapplicationPath);
    const usersService = this.app.service(userPath);

    const jobsCount = await jobsService.find({query:{$limit:0}});
    const jobApplicationsCount = await jobApplicationsService.find({query:{$limit:0}});
    const usersCount = await usersService.find({query:{$limit:0}});;
    // const usersCount2 = await usersService.find({pipeline:[{$match:{"firstname":"Peter"}}]});
    const usersCount2 = await usersService.find({
      pipeline: [
        {
          $match: {
            "firstname":"Peter"
          }
        },
      ],
      paginate: false
    })
    return {
      jobsCount,
      jobApplicationsCount,
      usersCount2
    };
  }


}

export const getOptions = (app) => {
  return { app }
}
