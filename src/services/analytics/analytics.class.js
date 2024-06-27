// src/services/analytics/analytics.class.js
import { jobPath } from "../jobs/jobs.shared.js";
import { jobapplicationPath } from "../jobapplications/jobapplications.shared.js";
import { userPath } from "../users/users.shared.js";

export class AnalyticsService {
  constructor(options) {
    this.options = options;
    this.app = options.app;
  }

  async find(_params) {
    let data = {};
    let query = _params.query;
    const jobsService = this.app.service(jobPath);
    const jobApplicationsService = this.app.service(jobapplicationPath);
    const usersService = this.app.service(userPath);

    if (query && query !== undefined) {
      for (const key of Object.keys(query)) {
        switch (key) {
          case 'analyticscount':
            console.log("in the analytics case");
            const jobsCount = await jobsService.find({ query: { $limit: 0 } });
            const jobApplicationsCount = await jobApplicationsService.find({ query: { $limit: 0 } });
            const usersCount = await usersService.find({ query: { $limit: 0 } });
            data.totaljobcount = jobsCount.total;
            data.totaljobapplicationscount = jobApplicationsCount.total;
            data.totaluser = usersCount.total;
            delete query['analyticscount'];
            break;
          default:
            break;
        }
      }
    }

    // Return the data
    return data;
  }
}

export const getOptions = (app) => {
  return { app };
}
