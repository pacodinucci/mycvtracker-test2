import { InterviewMode } from "./assignInterview_types";

export type Question = {
    id: number,
    question: string,
    questionType: string,
    option1: string,
    option2: string,
    option3: string,
    option4: string,
    correct: string,
    answered?: boolean
}

export type Questions = Question[]

export type Empdata = {
    id: number,
    name: string,
    companySize: string,
    industry: string,
    headquarter: string,
    website: string,
}

export type Empldata = Empdata[];

export type Referraldata = {
  id: number,
  name: string,
  email: string,
}
export type Referral = Referraldata[];

export type Recruiterparty = {

  id: number,
  name: string,
  email: string,
  website: string,
}

export type Recruiter = Recruiterparty[];

export type Candidatedata = {
    refCode: string;
    location: string;
    mobile: number;
    completed: string;
    id: number,
    candidate: string,
    candidateName: string,
    interviewType: string,
    score:number,
    matchingKeywords: string,
    token: string,
    jobLink: string,
    completedAt: string,
    createdAt:string,
    resumeId:number,
    resume?: CandidateResume,
    notes: string,
    interviewMode:  keyof typeof InterviewMode;
    timeBetweenQuestions: number;
    noOfQuestions: number;
}

export type Candidatsdata = Candidatedata[];

export type CandidateResume = {
    id: number,
    resumeTitle: string,
    uploadedAt: string,
    originalLinkId: string,
    maskedLinkId: string
}

export type InterviewSharing = {
  id: number
  fromUserId: number
  resumeId: number
  thirdPartyId: number,
  partyName: string,
  partyEmail: string,
  sharingContent: string,
  shortLink: string,
  status: `${StatusEnumKeys}`,
  showResume : boolean,
  showOriginResume : boolean,
  showResponse: boolean,
  showFullResponse: boolean,
  enableComment: boolean,
  accessToken: string,
  createdAt: number
}

export enum Status {
  CANDIDATE_REVIEW = "In Review Progress",
  CANDIDATE_INTERVIEW_BOOKED = "In Interview",
  CANDIDATE_PASSED = "Candidate Passed",
  CANDIDATE_REJECTED = "Candidate Rejected"
}

export type StatusEnumKeys = keyof typeof Status;


export type Resume = {
  id: number,
      userId: number,
      resumeTitle: string,
      resumeType: string,
      resumeName: string,
      uploadedAt: string,
      fileType: string,
      resumeReferral?: null,
      referralId?: null,
      parentReferralId?: null,
      resumeStatus?: null,
      sharedWith?: null,
      targetAccessToken?: null,
      previewToken?: null,
      maskedLinkId: string,
      previewExpiresAt?: null,
      extendPreviewToken?: null,
      originalPreviewToken?: null,
      originalLinkId: string,
      originalPreviewExpiresAt?: null,
      extendOriginalPreviewToken?: null,
      listingActive: boolean,
      noOfReviews: number,
      noOfSkills: number,
      downloadFile?: null,
      ownerEmail: string,
      name: string,
      skills: string[],
      resumeEmail: string,
      resumePhoneNumber?: string
}


export type Comment = {
  "id": number,
  "resumeReview": string,
  "feedbackUserId": number,
  "resumeId": number,
  "reviewerName": string,
  "interviewSharingId": number,
  "uploadedAt": string,
  "noOfReply": number,
  "feedbackUserLastName": string,
  "feedbackUserEmail": string,
  "feedbackUserFirstName": string
}

export type Reply = {
  "id": number,
  "replyContent": string,
  "userId": number,
  "reviewId": number,
  "uploadedAt": string,
  "userEmail": string,
  userName : string
}
