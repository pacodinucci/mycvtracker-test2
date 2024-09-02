import { Question } from "../../types/question_types";
import { apiInstance } from "./config";

export const getMyQuestions = async (token: string, interviewType: string) => {
  try {
    const response = await apiInstance.get(`/interviews/questions?token=${token}&interviewType=${interviewType}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
};
export const add = async (token: string, interviewType: string) => {
  try {
    const response = await apiInstance.get(`/interviews/questions?token=${token}&interviewType=${interviewType}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
};

export const getMyMCQuestions = async (token: string, interviewType: string) => {
  try {
    const response = await apiInstance.get(`/interviews/mcQuestions?token=${token}&interviewType=${interviewType}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
};
export const getQuestionById = async (id: number) => {
  try {
    const response = await apiInstance.get(`/interviews/question/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
};


export const getCandidateDetails = async (token: any, candToken: any) => {
  try {
    const response = await apiInstance.get(`/interviews/candidateDetails?token=${candToken}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
};
export const sendAddQuestion = async (token: string, question: Omit<Question, "id">) => {
  return await apiInstance.post("/interviews/addQuestion", question, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetQuestionsList = async (token: string, type: string) => {
  try {
    const response = await apiInstance.get(`/interviews/questionslist?interviewType=${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
};
export const sendEditQuestion = async (token: string, question: Question) => {
  try {
    const response = await apiInstance.put(`/interviews/editQuestion`, question, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
};

export const sendDeleteQuestion = async (token: string, question: Question) => {
  try {
    const response = await apiInstance.put(`/interviews/deleteQuestion`, question, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
};

//http://localhost:3005//interview-app/VideoInterview?token=4a979b61bfc749a7bb5a65eafc2aff65&interviewType=PRODUCTMANAGER01