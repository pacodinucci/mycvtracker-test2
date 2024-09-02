export type AudioResponse = {
  answerLocation: string;
  candidate: string;
  id: number;
  mcq?: boolean;
  question: string;
  questionId: number;
  token: string;
};
