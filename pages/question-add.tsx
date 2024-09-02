import React, { useCallback } from "react";
import { Container, Button, Title, Paper, Textarea, Radio } from "@mantine/core";

import { useForm } from "@mantine/form";
import { useUserState } from "../hooks/useUserState";
import { sendAddQuestion } from "../apis/mycvtracker/questions";

import { Question } from "../types/question_types";
import { useToast } from "../hooks/useToast";

const QuestionAdd = () => {
  const { showSuccessToast, showErrorToast } = useToast();
  const { token } = useUserState();
  const details = useForm({
    initialValues: {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct: "option1",
      difficulty: "1",
      questionType: "",
    },
    validate: {
      question: (value) => (value.length < 1 ? "Question cannot be empty" : null),
      option1: (value) => (value.length < 1 ? "Option 1 cannot be empty" : null),
      option2: (value) => (value.length < 1 ? "Option 2 cannot be empty" : null),
      option3: (value) => (value.length < 1 ? "Option 3 cannot be empty" : null),
      option4: (value) => (value.length < 1 ? "Option 4 cannot be empty" : null),
      // correct: (value) => value.length < 1 ? "Qustion cannot be empty" : null,
      questionType: (value) => (value.length < 1 ? "Question Type cannot be empty" : null),
    },
    transformValues: (values) => ({
      questionType: values.questionType + values.difficulty,
      question: values.question,
      option1: values.option1,
      option2: values.option2,
      option3: values.option3,
      option4: values.option4,
      correct: values[values.correct as keyof Pick<Question, "option1" | "option2" | "option3" | "option4">],
    }),
  });

  const handleAddQuestion = useCallback(
    async (values: Omit<Question, "id">) => {
      // return console.log(values);
      try {
        await sendAddQuestion(token, values);
        showSuccessToast("Request submitted successfully");
      } catch (e) {
        showErrorToast("Encounted an Error");
      }
    },
    [token, showSuccessToast, showErrorToast]
  );

  return (
    <Container>
      <Title order={1}>Add Question</Title>
      <Paper p="md" my="md">
        <form onSubmit={details.onSubmit(handleAddQuestion)}>
          <Textarea placeholder="Question" label="Question" withAsterisk {...details.getInputProps("question")} />
          <Textarea placeholder="Option 1" label="Option 1" withAsterisk {...details.getInputProps("option1")} />
          <Textarea placeholder="Option 2" label="Option 2" withAsterisk {...details.getInputProps("option2")} />
          <Textarea placeholder="Option 3" label="Option 3" withAsterisk {...details.getInputProps("option3")} />
          <Textarea placeholder="Option 4" label="Option 4" withAsterisk {...details.getInputProps("option4")} />
          <Radio.Group withAsterisk {...details.getInputProps("correct")} label="Correct Answer">
            <Radio value="option1" label="Option 1" />
            <Radio value="option2" label="Option 2" />
            <Radio value="option3" label="Option 3" />
            <Radio value="option4" label="Option 4" />
          </Radio.Group>
          <Textarea
            placeholder="Question Type"
            label="Question Type"
            withAsterisk
            {...details.getInputProps("questionType")}
          />
          <Radio.Group label="Difficulty Level" {...details.getInputProps("difficulty")}>
            <Radio value="1" label="1" />
            <Radio value="2" label="2" />
            <Radio value="3" label="3" />
            <Radio value="4" label="4" />
            <Radio value="5" label="5" />
          </Radio.Group>
          <Button type="submit" my="md">
            Add Question
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default QuestionAdd;
