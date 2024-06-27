// src/services/analytics/analytics.class.js
import { jobPath } from '../jobs/jobs.shared.js';
import { jobapplicationPath } from '../jobapplications/jobapplications.shared.js';
import { userPath } from '../users/users.shared.js';

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
            console.log('in the analytics count case');
            const jobsCount = await jobsService.find({ query: { $limit: 0 } });
            const jobApplicationsCount = await jobApplicationsService.find({ query: { $limit: 0 } });
            const usersCount = await usersService.find({ query: { $limit: 0 } });
            const engagements = await jobApplicationsService.find({
              query: {
                status: { $in: ['Approved', 'Completed'] },
                $limit: 0
              }
            });
            data.totaljobcount = jobsCount.total;
            data.totaljobapplicationscount = jobApplicationsCount.total;
            data.totalusercount = usersCount.total;
            data.engagementcount = engagements.total;
            delete query['analyticscount'];
            break;

          case 'locationanalytics':
            console.log('in the location analytics case');
            const result = await usersService.find({
              // query: { $limit: 0 },
              pipeline: [
                {
                  $group: {
                    _id: {
                      state: { $ifNull: ['$location.state', 'unknown'] },
                      city: { $ifNull: ['$location.city', 'unknown'] },
                      district: { $ifNull: ['$location.district', 'unknown'] }
                    },
                    count: { $sum: 1 }
                  }
                },
                {
                  $group: {
                    _id: null,
                    state: {
                      $push: {
                        k: '$_id.state',
                        v: '$count'
                      }
                    },
                    city: {
                      $push: {
                        k: '$_id.city',
                        v: '$count'
                      }
                    },
                    district: {
                      $push: {
                        k: '$_id.district',
                        v: '$count'
                      }
                    },
                    totalStateCount: { $sum: '$count' },
                    totalCityCount: { $sum: '$count' },
                    totalDistrictCount: { $sum: '$count' }
                  }
                },
                {
                  $project: {
                    _id: 0,
                    state: { $arrayToObject: '$state' },
                    city: { $arrayToObject: '$city' },
                    district: { $arrayToObject: '$district' },
                    totalStateCount: 1,
                    totalCityCount: 1,
                    totalDistrictCount: 1
                  }
                }
              ]
            });

            // Extracting the result from the array (assuming only one result)
            console.log('location Result', result);
            data = result.data[0];
            console.log('data', data);
            delete query['locationanalytics'];
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
};
