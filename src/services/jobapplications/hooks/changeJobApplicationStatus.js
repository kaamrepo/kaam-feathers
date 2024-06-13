import { BadRequest } from '@feathersjs/errors'
import { jobPath } from '../../jobs/jobs.shared.js'
import { jobapplicationPath } from '../jobapplications.shared.js'

export const changeJobApplicationStatus = async (hook) => {
  if (!hook.data || !hook.data.status) {
    return hook
  }

  const { status } = hook.data
  const { id, app } = hook

  try {
    const jobApplication = await app.service(jobapplicationPath).get(id)
    validateJobApplication(jobApplication)

    const {
      employerid: employerId,
      jobDetails: { numberofopenings: numberOfOpenings, _id: jobId },
      employerDetails: { allowedjobposting: allowedJobPostingForEmployer },
      applicantDetails: { allowedjobapplication: allowedJobApplicationForEmployee }
    } = jobApplication

    await validateFields({
      employerId,
      numberOfOpenings,
      jobId,
      allowedJobPostingForEmployer,
      allowedJobApplicationForEmployee
    })

    if (status === 'Approved') {
      await handleApproval({
        app,
        jobId,
        numberOfOpenings,
        allowedJobPostingForEmployer,
        allowedJobApplicationForEmployee
      })
    } else if (status === 'Rejected') {
      console.log('JOB Rejected')
      // Perform any additional actions for rejected status if needed
    } else {
      throw new BadRequest('Invalid status')
    }
  } catch (error) {
    console.error('Error changing job application status:', error.message)
    throw new BadRequest(error.message)
  }

  return hook
}

const validateJobApplication = (jobApplication) => {
  if (!jobApplication) {
    throw new BadRequest('Job application not found')
  }
  if (!jobApplication.jobDetails) {
    throw new BadRequest('Job not found')
  }
}

const validateFields = async ({
  employerId,
  numberOfOpenings,
  jobId,
  allowedJobPostingForEmployer,
  allowedJobApplicationForEmployee
}) => {
  if (!employerId) {
    throw new BadRequest('Employer ID not found')
  }
  if (numberOfOpenings === undefined) {
    throw new BadRequest('Number of openings not found')
  }
  if (!jobId) {
    throw new BadRequest('Job ID not found')
  }
  if (allowedJobPostingForEmployer === undefined) {
    throw new BadRequest('Allowed job postings for employer not found')
  }
  if (allowedJobApplicationForEmployee === undefined) {
    throw new BadRequest('Allowed job applications for employee not found')
  }
}

const handleApproval = async ({
  app,
  jobId,
  numberOfOpenings,
  allowedJobPostingForEmployer,
  allowedJobApplicationForEmployee
}) => {
  if (numberOfOpenings <= 0) {
    console.log('In the number of opening===', numberOfOpenings)
    throw new BadRequest('No job openings available')
  }
  if (allowedJobPostingForEmployer <= 0) {
    throw new BadRequest('Employer allowed job posting expired')
  }
  if (allowedJobApplicationForEmployee <= 0) {
    throw new BadRequest('Employee allowed job application expired')
  }

  const updatedNumberOfOpening = numberOfOpenings - 1
  await app.service(jobPath)._patch(jobId, {
    numberofopenings: updatedNumberOfOpening
  })
}
