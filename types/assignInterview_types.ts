export type AssignInterviewRequest = {
  candidateName: string;
  invite: string;
  resultOwners: string;
  candidateEmail: string;
  interviewType: string;
  noOfQuestions: string;
  jobLink: string;
  candidateList: string;
  deadline: string;
  employerId: number;
};
export type AssignrefInterviewRequest = {
  candidateName: string;
  invite: string;
  resultOwners: string;
  candidateEmail: string;
  interviewType: string;
  noOfQuestions: string;
  referralId: number;
  candidateList: string;
  // date:string;
};

// export type CandidateResultRequest = {
//   candidate: string;
//   candidateEmail: string;
//   candidateList: string;
//   candidateName: string;
//   interviewType: string;
//   invite: string;
//   jobLink: string;
//   resultOwners: string;
//   token: string;
// };
export type CandidateResultRequest = {
  token: string;
};

export type schduleInterviewRequest = {
  candidateName: string;
  invite: string;
  resultOwners: string;
  candidateEmail: string;
  jobLink: string;
  candidateList: string;
  calendlyLink: string;
  thirdPartyId: string;
};
export type addEmployerRequest = {
  name: string;
  email: string;
  companySize: string;
  industry: string;
  headquarter: string;
  website: string;
};
export type addRecruiterRequest = {
  name: string;
  email: string;
  website: string;
};
export type addReferralRequest = {
  name: string;
  email: string;
};
export type addJobDetails = {
  jobTittle: string;
  jobLink: string;
  mycvTrackerLink: string;
  employerName: string;
  UploadAudio: string;
};
export type addRefEmployerData = {
  firstName: string;
  lastName: string;
  email: string;
};

export type BookInterviewslot = {
  candidateName: string;
  candidateEmail: string;
  mobile: string;
  location: string;

  skills: string;
};

export type BookTechInterviewslot = {
  candidateName: string;
  candidateEmail: string;
  mobile: string;
  location: string;
  interviewDate: string;
  timeSlot: string;
  skills: string;
  timeZone: string;
};

export const InterviewMode = {
  AUDIO: "Audio",
  AUDIO_VIDEO: "Audio / Video", // not working
  AUDIO_FEEDBACK: "Audio Feedback",
  MCQ: "Multiple choice",
  AUDIO_WITH_HR: "Audio with HR question",
  MCQ_WITH_HR: "Multiple choice with HR question",
  VIDEO: "Video",
  VIDEO_WITH_HR: "Video with HR",
  FULL_VIDEO: "Full Video",
  FULL_VIDEO_WITH_HR: "Full Video with HR",
};
