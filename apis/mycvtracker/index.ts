import { AudioResponse } from "../../types/audioResponse_types";
import { apiInstance } from "./config";
import { schduleInterviewRequest } from "../../types/assignInterview_types";

import {
  sendLoginUser,
  sendAddUser,
  sendForgotPasswordRequest,
  sendGetUserProfileSettings,
  sendUpdateProfileSettings,
} from "./auth";
import {
  sendAssignInterview,
  sendEmployerData,
  sendGetCandidateResult,
  sendRefAssignInterview,
  sendSchduleInterview,
} from "./assign-interview";
import { Candidatedata } from "../../types/question_types";

const getInterviewResponses = async (token: string) => {
  return await apiInstance.get<AudioResponse[]>(
    `/interviews/interviewResponse/${token}`,
    {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    }
  );
};
const getInterviewResults = async (
  token: string,
  page: number,
  noRec: number,
  type:string,
  candidateEmail: string
) => {
  return await apiInstance.get(
    `/interviews/candidateList?page=${page}&noOfRecords=${noRec}&type=${type}${
      candidateEmail ? `&candidateEmail=${candidateEmail}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


const getInterviewSharings = async (
  token: string,
  candidate: Candidatedata,
  page: number = 1,
  noRec: number = 50,

) => {
  const {id} = candidate;
  return await apiInstance.get(
    `thirdparty-sharing/list?candidateDetailsId=${id}&page=${page}&noOfRecords=${noRec}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getCandidateLsitCount = async (token: string,type:string, candidateEmail: string) => {
  return await apiInstance.get(`interviews/candidateCount?&type=${type}${
    candidateEmail ? `&candidateEmail=${candidateEmail}` : ""
  }`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const showEmployerResults = async (
  token: string,
  page: number,
  noRec: number,
  type:string,
  nameOrEmail: string = "",
) => {
  return await apiInstance.get(
    `thirdparty/getThirdPartyList?page=${page}&noOfRecords=${noRec}&type=${type}${
      nameOrEmail ? `&nameOrEmail=${nameOrEmail}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getPartyLsitCount = async (token: string,type:string, nameOrEmail: string = "") => {
  return await apiInstance.get(`thirdparty/thirdPartyCount?&type=${type}${
    nameOrEmail ? `&nameOrEmail=${nameOrEmail}` : ""
  }`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const showThirdParties = async (
  token: string,
  page: number,
  noRec: number,
  nameOrEmail: string = "",
  type: string
) => {
  return await apiInstance.get(
    `thirdparty/getThirdPartyList?page=${page}&noOfRecords=${noRec}${
      nameOrEmail ? `&nameOrEmail=${nameOrEmail}` : ""
    }${type ? `&type=${type}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteCandidate = async (candToken: any, token: string) => {
  return await apiInstance.delete(`interviews/${candToken}/deleteInterview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const deleteEmployer = async (empId: any, token: string) => {
  return await apiInstance.delete(`thirdparty/id/${empId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


const lookupResumes = async ({email = '', pageNo = 1, numOfRecords = 20} : {email?: string, pageNo? : number, numOfRecords?: number}, token: string) => {
  return await apiInstance.get(`user/active-resumes/list?page=${pageNo}&noOfRecords=${numOfRecords}${email? `&candidateEmail=${email}`: ''}&withJob=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const linkResumeToCandidateApi = async (token: string, interviewToken: string, resumeId: number) => {
  return await apiInstance.put(`interviews/${interviewToken}/linkResume/${resumeId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createInterviewSharing = async (values: any, candidate: Candidatedata, token: string) => {
  return apiInstance.post(`/interviews/${candidate.token}/sharing`, values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const saveAddNotes = async (values: any, cand_token: Candidatedata, token: string) => {
  return apiInstance.post(`/interviews/${cand_token}/addNote`, values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateInterviewSharing = async (values: any, sharingId: number, token: string) => {
  return apiInstance.put(`/thirdparty-sharing/id/${sharingId}`, values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getInterviewPartySharing = async (
  shortLink: string
) => {
  return await apiInstance.get(
    `/thirdparty-sharing/shortLink/${shortLink}`
  );
};

const getInterviewSharingResults = async (
  shortLink: string
) => {
  return await apiInstance.get(
    `/interviews/thirdParty/getResult/${shortLink}`
  );
};

const getInterviewSharingResume = async (
  shortLink: string
) => {
  return await apiInstance.get(
    `/thirdparty-sharing/resume/${shortLink}`
  );
};

const getInterviewSharing = async (
  shortLink: string
) => {
  return await apiInstance.get(
    `/thirdparty-sharing/shortLink/${shortLink}`
  );
};


const deleteInterviewSharingResume = async (
  id: number, token: string
) => {
  return await apiInstance.delete(
    `/thirdparty-sharing/id/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getComments = async (
  accessToken: string,
  token: string
) => {
  return await apiInstance.get(
    `/thirdparty-sharing/${accessToken}/reviews/list`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const getReplies = async (
  reviewId: number
) => {
  return await apiInstance.get(
    `thirdparty-sharing/${reviewId}/reply/list`
  );
};


const createComment = async (values: any, token?: string) => {
  const headers: Record<string,any> = {}
  if(token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return apiInstance.post(`/thirdparty-sharing/review/new`, values, {
    headers
  });
};

const createReply = async (values: any, token?: string) => {
  const headers: Record<string,any> = {}
  if(token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return apiInstance.post(`/thirdparty-sharing/review/reply`, values, {
   headers
  });
};

export {
  sendLoginUser,
  sendAddUser,
  sendForgotPasswordRequest,
  sendUpdateProfileSettings,
  sendGetUserProfileSettings,
  getInterviewResponses,
  sendAssignInterview,
  sendRefAssignInterview,
  sendGetCandidateResult,
  getInterviewResults,
  showEmployerResults,
  sendSchduleInterview,
  sendEmployerData,
  getCandidateLsitCount,
  getPartyLsitCount,
  deleteCandidate,
  deleteEmployer,
  lookupResumes,
  linkResumeToCandidateApi,
  getInterviewSharings,
  createInterviewSharing,
  getInterviewPartySharing,
  getInterviewSharingResults,
  getInterviewSharingResume,
  showThirdParties,
  getComments,
  getReplies,
  createComment,
  createReply,
  updateInterviewSharing,
  saveAddNotes,
  deleteInterviewSharingResume
};
