import { Button, Paper, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useCallback, useState } from "react";
import { sendDeleteQuestion, sendEditQuestion } from "../apis/mycvtracker/questions";
import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";
import { Question } from "../types/question_types";
import { alerts } from "../utils/alert-utils";

type Props = {
  question: Question;
  onDelete: (id: number) => void;
};

const QuestionCard = ({ question, onDelete }: Props) => {
  const { token } = useUserState();
  const { showErrorToast, showSuccessToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const details = useForm({
    initialValues: {
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      correct: question.correct,
      questionType: question.questionType,
      id: question.id,
    },
    validate: {
      question: (value) => (value.length < 1 ? "Qustion cannot be empty" : null),
      // correct: (value) => value.length < 1 ? "Qustion cannot be empty" : null,
      option1: (value) => (value.length < 1 ? "Option 1 cannot be empty" : null),
      option2: (value) => (value.length < 1 ? "Option 2 cannot be empty" : null),
      option3: (value) => (value.length < 1 ? "Option 3 cannot be empty" : null),
      option4: (value) => (value.length < 1 ? "Option 4 cannot be empty" : null),
      questionType: (value) => (value.length < 1 ? "Qustion Type cannot be empty" : null),
    },
  });

  const handleQuestionUpdate = useCallback(
    async (values: Question) => {
      try {
        setIsLoading(true);
        await sendEditQuestion(token, values);
        showSuccessToast("Values Update Successfully");
      } catch (e: any) {
        if (alerts[e.response.status]) showErrorToast(alerts[e.response.status].message);
        else showErrorToast("Encountered Some Error");
      } finally {
        setIsLoading(false);
      }
    },
    [token, showErrorToast, showSuccessToast]
  );
  const handlDeleteQuestion = useCallback(
    async (values: Question) => {
      try {
        setIsLoading(true);
        await sendDeleteQuestion(token, values);
        showSuccessToast("Question Deleted Successfully");
        onDelete(values.id);
      } catch (e: any) {
        if (alerts[e.response.status]) showErrorToast(alerts[e.response.status].message);
        else showErrorToast("Encountered Some Error");
      } finally {
        setIsLoading(false);
      }
    },
    [token, showErrorToast, showSuccessToast, onDelete]
  );

  return (
    <Paper p="md" my="md">
      <form onSubmit={details.onSubmit(handleQuestionUpdate)}>
        <Textarea placeholder="Question" label="Question" withAsterisk {...details.getInputProps("question")} />
        <Textarea placeholder="Option 1" label="Option 1" withAsterisk {...details.getInputProps("option1")} />
        <Textarea placeholder="Option 2" label="Option 2" withAsterisk {...details.getInputProps("option2")} />
        <Textarea placeholder="Option 3" label="Option 3" withAsterisk {...details.getInputProps("option3")} />
        <Textarea placeholder="Option 4" label="Option 4" withAsterisk {...details.getInputProps("option4")} />
        <Textarea placeholder="Correct" label="Correct" withAsterisk {...details.getInputProps("correct")} />

        <Textarea
          placeholder="Question Type"
          label="Question Type"
          withAsterisk
          {...details.getInputProps("questionType")}
        />
        <Button type="submit" my="md" disabled={isLoading}>
          Update Question
        </Button>
        <Button onClick={() => handlDeleteQuestion(details.values)} color="red" m="md" disabled={isLoading}>
          Delete Question
        </Button>
      </form>
    </Paper>
  );
};

export default QuestionCard;
