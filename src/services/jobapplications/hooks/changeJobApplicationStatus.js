import { BadRequest } from '@feathersjs/errors';
import { jobPath } from '../../jobs/jobs.shared.js';
import { jobapplicationPath } from '../jobapplications.shared.js';

export const changeJobApplicationStatus = async (hook) => {
  if (hook.data && hook.data.status) {
    try {
      const jobApplication = await hook.app.service(jobapplicationPath).get(hook.id);

      if (!jobApplication) {
        throw new BadRequest('Job application not found');
      }
      if (!jobApplication.jobDetails) {
        throw new BadRequest('Job not found');
      }

      const employerId = jobApplication?.employerid;
      const numberOfOpenings = jobApplication?.jobDetails?.numberofopenings;
      const jobId = jobApplication.jobDetails._id; // Ensure jobId is a string
      const allowedJobPostingForEmployer = jobApplication?.employerDetails?.allowedjobposting;
      const allowedJobApplicationForEmployee = jobApplication?.applicantDetails?.allowedjobapplication;

      // Validate essential data presence before proceeding
      if (!employerId) {
        throw new BadRequest('Employer ID not found');
      }
      if (numberOfOpenings === undefined) {
        throw new BadRequest('Number of openings not found');
      }
      if (!jobId) {
        throw new BadRequest('Job ID not found');
      }
      if (allowedJobPostingForEmployer === undefined) {
        throw new BadRequest('Allowed job postings for employer not found');
      }
      if (allowedJobApplicationForEmployee === undefined) {
        throw new BadRequest('Allowed job applications for employee not found');
      }

      switch (hook.data.status) {
        case 'Approved':
          console.log("approved case");
          if (numberOfOpenings <= 0) {
            throw new BadRequest('No job openings available');
          }
          if (allowedJobPostingForEmployer <= 0) {
            throw new BadRequest('Employer allowed job posting expired');
          }
          if (allowedJobApplicationForEmployee <= 0) {
            throw new BadRequest('Employee allowed job application expired');
          }

          const updatedNumberOfOpening = numberOfOpenings - 1;
          const updateJobResponse = await hook.app.service(jobPath)._patch(jobId, {
            numberofopenings: updatedNumberOfOpening
          });
          break;
        case 'Rejected':
          console.log('JOB Rejected');
          // Perform any additional actions for rejected status if needed
          break;
        default:
          throw new BadRequest('Invalid status');
      }
    } catch (error) {
      console.error('Error changing job application status:', error.message);
      console.log("------",hook.data);
      throw new BadRequest(error.message);
    }
  }
  return hook;
};
