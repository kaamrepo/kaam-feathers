import { jobPath } from '../jobs/jobs.shared.js'
import { jobapplicationPath } from '../jobapplications/jobapplications.shared.js'
import { userPath } from '../users/users.shared.js'

export class AnalyticsService {
  constructor(options) {
    this.options = options
    this.app = options.app
  }

  async find(_params) {
    let data = {}
    let query = _params.query
    const jobsService = this.app.service(jobPath)
    const jobApplicationsService = this.app.service(jobapplicationPath)
    const usersService = this.app.service(userPath)

    if (query && query !== undefined) {
      for (const key of Object.keys(query)) {
        switch (key) {
          case 'analyticscount':
            const jobsCount = await jobsService.find({ query: { $limit: 0 } })
            const jobApplicationsCount = await jobApplicationsService.find({ query: { $limit: 0 } })
            const usersCount = await usersService.find({ query: { $limit: 0 } })
            const engagements = await jobApplicationsService.find({
              query: {
                status: { $in: ['Approved', 'Completed'] },
                $limit: 0
              }
            })
            data.totaljobcount = jobsCount.total
            data.totaljobapplicationscount = jobApplicationsCount.total
            data.totalusercount = usersCount.total
            data.engagementcount = engagements.total
            delete query['analyticscount']
            break

          case 'locationanalytics':
            const result = await usersService.find({
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
            })

            // Extracting the result from the array (assuming only one result
            data = result.data[0]
            delete query['locationanalytics']
            break

          case 'userbifercationanalytics':
            const userbifercationresult = await usersService.find({
              pipeline: [
                {
                  $unwind: '$roles'
                },
                {
                  $match: {
                    roles: { $in: ['employee', 'employer'] }
                  }
                },
                {
                  $group: {
                    _id: '$_id',
                    roles: { $addToSet: '$roles' }
                  }
                },
                {
                  $group: {
                    _id: null,
                    employeeCount: {
                      $sum: {
                        $cond: { if: { $in: ['employee', '$roles'] }, then: 1, else: 0 }
                      }
                    },
                    employerCount: {
                      $sum: {
                        $cond: { if: { $in: ['employer', '$roles'] }, then: 1, else: 0 }
                      }
                    },
                    mixedRolesCount: {
                      $sum: {
                        $cond: {
                          if: {
                            $and: [{ $in: ['employee', '$roles'] }, { $in: ['employer', '$roles'] }]
                          },
                          then: 1,
                          else: 0
                        }
                      }
                    }
                  }
                }
              ]
            })

            // Assuming the userbifercationresult contains only one document
            const rawData = userbifercationresult.data[0]
           
            // Calculate the total count for normalization
            const totalCount = rawData.employeeCount + rawData.employerCount + rawData.mixedRolesCount

            // Normalize the counts to percentages
            data.employee = (rawData.employeeCount / totalCount) * 100
            data.employer = (rawData.employerCount / totalCount) * 100
            data.mixed = (rawData.mixedRolesCount / totalCount) * 100

            delete query['userbifercationanalytics']
            break

          case 'registrationanalytics':
            let dateFormat
            switch (query.timeframe) {
              case 'Day':
                dateFormat = '%Y-%m-%d'
                break
              case 'Week':
                dateFormat = '%Y-%W' // Week format
                break
              case 'Month':
                dateFormat = '%Y-%m'
                break
              case 'Year':
                dateFormat = '%Y'
                break
              default:
                dateFormat = '%Y-%m-%d'
                break
            }

            const registrationData = await usersService.find({
              query: {
                $group: {
                  _id: {
                    $dateToString: { format: dateFormat, date: '$createdat' }
                  },
                  count: { $sum: 1 }
                }
              },
              pipeline: [
                {
                  $group: {
                    _id: {
                      $dateToString: { format: dateFormat, date: '$createdat' }
                    },
                    count: { $sum: 1 }
                  }
                },
                {
                  $project: {
                    _id: 0,
                    timeframe: '$_id',
                    count: '$count'
                  }
                }
              ]
            })

            // Flatten and sort the data
            data = registrationData.data.sort((a, b) => new Date(a.timeframe) - new Date(b.timeframe))

            // Make sure we have a default structure if no data is returned
            if (!data.length) {
              data = [{ timeframe: moment().format(dateFormat), count: 0 }]
            }


            delete query['registrationanalytics']
            break

          default:
            break
        }
      }
    }

    return data
  }
}

export const getOptions = (app) => {
  return { app }
}
