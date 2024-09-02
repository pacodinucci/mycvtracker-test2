import { apiInstance } from "./config";
import { InterviewMode } from "../../types/assignInterview_types"; // Adjust the import path as necessary

import { AssignInterviewRequest, AssignrefInterviewRequest, BookInterviewslot, BookTechInterviewslot, CandidateResultRequest, addEmployerRequest, addRecruiterRequest, addRefEmployerData, addReferralRequest, schduleInterviewRequest } from "../../types/assignInterview_types";

export const sendAssignInterview = async (values: AssignInterviewRequest, token: string) => {
  return apiInstance.post("interviews/assignInterview", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const assignInterviewMode = async (mode: keyof typeof InterviewMode, token: string) => {
  const values = {
    mode: InterviewMode[mode] // Use the selected interview mode
  };

  return apiInstance.post("interviews/assignInterview", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const bookTechInterview = async (values: BookTechInterviewslot, token: string) => {
  return apiInstance.post("interviews/booktechslot", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendRefAssignInterview = async (values: AssignrefInterviewRequest, token: string) => {
  return apiInstance.post("interviews/assignInterview", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const sendRemiderRequest = async (candToken: any, token: string) => {
  return apiInstance.put("interviews/sendReminders", candToken, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendGetCandidateResult = async (values: CandidateResultRequest, token: string) => {
  return apiInstance.put("interviews/candidateResults", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const sendSchduleInterview = async (values: schduleInterviewRequest, token: string) => {
  return apiInstance.post("interviews/candidate/schedule-link", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const addReferralEmp = async (values: addRefEmployerData, token: string) => {
  return apiInstance.post("interviews/candidate/schedule-link", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const sendEmployerData = async (values: addEmployerRequest, token: string) => {
  return apiInstance.post("thirdparty/", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const bookInterviewSlots = async (values: BookInterviewslot, token: string) => {
  return apiInstance.post("interviews/booktechslot", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const sendReferralData = async (values: addReferralRequest, token: string) => {
  return apiInstance.post("thirdparty/", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const sendRecuuiterData = async (values: addRecruiterRequest, token: string) => {
  return apiInstance.post("thirdparty/", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// export const getIntResultByEmail = async (tokenVal:CandidateResultRequest, token:string) =>{
//      return apiInstance.put(`interviews/candidateResults/${tokenVal}`,{
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//      };
