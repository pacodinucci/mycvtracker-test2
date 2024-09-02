import { InterviewSkillCategory, InterviewTopic } from "../types/interview_skill_category_type";

const toInterviewTopic = (interviewSkillCategory : InterviewSkillCategory): InterviewTopic => {
  const {id : value, displayName: label, disabled} = interviewSkillCategory;
  return {label, value, disabled}
}

export const toInterviewTopics = (categories : InterviewSkillCategory[]) : InterviewTopic[] => {
  return categories.map(category => toInterviewTopic(category))
}
