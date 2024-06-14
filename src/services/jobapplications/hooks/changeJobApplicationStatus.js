import { BadRequest } from '@feathersjs/errors'
import { jobPath } from '../../jobs/jobs.shared.js'
import { jobapplicationPath } from '../jobapplications.shared.js'
import { userPath } from '../../users/users.shared.js'

export const changeJobApplicationStatus = async (hook) => {
  const { data, id, app } = hook

  if (!data || !data.status) {
    return hook
  }

  const { status } = data

  try {
    const jobApplication = await app.service(jobapplicationPath).get(id)
    validateJobApplication(jobApplication)
    const {
      employerid: employerId,
      jobDetails: { numberofopenings: numberOfOpenings, _id: jobId },
      employerDetails: { allowedjobposting: allowedJobPostingForEmployer },
      applicantDetails: { allowedjobapplication: allowedJobApplicationForEmployee, _id: employeeId }
    } = jobApplication

    await validateFields({
      employerId,
      numberOfOpenings,
      jobId,
      allowedJobPostingForEmployer,
      allowedJobApplicationForEmployee,
      employeeId
    })

    if (status === 'Approved') {
      await handleApproval({
        app,
        jobId,
        numberOfOpenings,
        allowedJobPostingForEmployer,
        allowedJobApplicationForEmployee,
        employeeId
      })
    } 
    else if (status === 'Completed') {
      console.log('JOB Completed');
      
      // Perform any additional actions for rejected status if needed
    } 
    else if (status === 'Rejected') {
      console.log('JOB Completed')
      // Perform any additional actions for rejected status if needed
    } 
    
    else {
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
  allowedJobApplicationForEmployee,
  employeeId
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
  if (!employeeId) {
    throw new BadRequest('Employee ID not found')
  }
}

const handleApproval = async ({
  app,
  jobId,
  numberOfOpenings,
  allowedJobPostingForEmployer,
  allowedJobApplicationForEmployee,
  employeeId
}) => {
  if (numberOfOpenings <= 0) {
    throw new BadRequest('Job openings full, increase openings')
  }
  if (allowedJobPostingForEmployer <= 0) {
    throw new BadRequest('Employer allowed job posting expired')
  }
  if (allowedJobApplicationForEmployee <= 0) {
    throw new BadRequest('Employee allowed job application expired')
  }

  await app.service(jobPath)._patch(jobId, {
    numberofopenings: numberOfOpenings - 1
  })
  await app.service(userPath)._patch(employeeId, {
    allowedjobapplication: allowedJobApplicationForEmployee - 1
  })
}
