import { InterviewSkillCategory } from "../../types/interview_skill_category_type";
import { apiInstance } from "./config";

const baseURL = '/interviews/skill-category';
export const getInterviewSkillCategories = async (params = {}) => {

  const urlParam = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val) {
      urlParam.set(key, `${val}`)
    }
  })

  try {
    const response = await apiInstance.get(`${baseURL}?${urlParam.toString()}&usePagination=false`);
    if (response.status === 200) {
      return response.data?.items || [];
    }
  } catch (e) {
    throw e;
  }
};


export const getPaginableInterviewSkillCategories = async (params = {}) => {

  const urlParam = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val) {
      urlParam.set(key, `${val}`)
    }
  })

  try {
    const response = await apiInstance.get(`${baseURL}?${urlParam.toString()}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
};

export const addInterviewSkillCategory = async (token: string, skillCategory : InterviewSkillCategory) => {
  try {
    const response = await apiInstance.post(baseURL, skillCategory, {
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

export const editInterviewSkillCategory = async (token: string, skillCategory: InterviewSkillCategory) => {
  try {
    const response = await apiInstance.put(baseURL, skillCategory, {
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

export const deleteInterviewSkillCategory = async (token: string, skillCategoryId: string) => {
  try {
    const response = await apiInstance.delete(`${baseURL}/${skillCategoryId}`, {
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
