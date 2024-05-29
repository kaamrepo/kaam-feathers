import { BadRequest } from '@feathersjs/errors'

export const changeJobApplicationStatus = async (hook) => {
  if (hook.data && hook.data.status) {
    try {
      console.log("hook.data",hook.data);
      console.log("hookid",hook.id);
      const jobApplication = await hook.app.service('api/jobapplications').get(hook.id)
      if (!jobApplication) {
        throw new BadRequest('Job application not found')
      }
      if (!jobApplication.jobDetails) {
        throw new BadRequest('Job not found')
      }
      switch (hook.data.status) {
        case 'Approved':
          // if (jobApplication.jobDetails.numberofopenings === 0) {
          //   throw new BadRequest('No job openings available')
          // }
          const updatedOtpCount = Number(jobApplication.jobDetails.numberofopenings - 1)
          await hook.app.service('api/jobs').patch(jobApplication.jobid, {
            numberofopenings: updatedOtpCount
          })
          break
        case 'Rejected':
          console.log('JOB Rejected')
          // Perform any additional actions for rejected status if needed
          break
        default:
          throw new BadRequest('Invalid status')
      }
    } catch (error) {
      console.error('Error changing job application status:', error.message)
      throw new BadRequest(error.message)
    }
  }
  return hook
}
