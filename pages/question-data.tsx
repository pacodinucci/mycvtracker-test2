import { ActionIcon, Alert, Autocomplete, Button, Container, Loader, Radio, Title, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { GetQuestionsList } from "../apis/mycvtracker/questions";
import QuestionCard from "../components/QuestionCard";
import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";
import { Question } from "../types/question_types";
import { alerts } from "../utils/alert-utils";
import { getInterviewSkillCategories } from "../apis/mycvtracker/interview-skill-catogory";
import { toInterviewTopics } from "../utils/interview-skill-category-utils";
import { InterviewSkillCategory } from "../types/interview_skill_category_type";
import { useRouter } from "next/router";

const QuestionData = () => {
  const { showErrorToast } = useToast();
  const theme = useMantineTheme();
  const { token } = useUserState();
  const router = useRouter();
  const [responses, setResponses] = useState({ loading: false, questions: null as Question[] | null });


  const [interviewSkills, setinterviewSkills] = useState<InterviewSkillCategory[]>([])

  const getInterviewSkills = useCallback(
    async (params: Record<string, string |number> = {}) => {
     const res = await getInterviewSkillCategories(params)
     setinterviewSkills(res)
    },
    [],
  )

  useEffect(() => {
    getInterviewSkills()
  }, [getInterviewSkills])


  const InterviewTopics =  useMemo(() => toInterviewTopics(interviewSkills), [interviewSkills]);


  const details = useForm({
    initialValues: {
      type: "",
      difficulty: "1",
    },
    validate: {
      type: (value) => (value.length < 1 ? "Please enter a valid type" : null),
    },
  });

  type FormType = typeof details.values;

  const fetchQuestion = useCallback(
    async ({ type, difficulty }: FormType) => {
      const existing = InterviewTopics.find((t) => t.label.toLowerCase() === type.toLowerCase());
      try {
        if (existing) type = existing.value;
        setResponses((prev) => ({ ...prev, loading: true }));
        const questions = await GetQuestionsList(token, `${type}${difficulty}`);
        setResponses({ questions, loading: false });
      } catch (e: any) {
        if (alerts[e.response.status]) showErrorToast(alerts[e.response.status].message);
        else showErrorToast("Encountered Some Error");
        setResponses((prev) => ({ ...prev, loading: false }));
      }
    },
    [token, showErrorToast]
  );

  const deleteQuestion = useCallback((id: number) => {
    setResponses((prev) => {
      return prev.questions !== null ? { ...prev, questions: prev.questions.filter((q) => q.id !== id) } : prev;
    });
  }, []);

  return (
    <Container>
      <Title order={1}>Question Data</Title>
      <Button
        sx={{ marginLeft: '10px'}}
        type="button"
        variant="filled"
        my="sm"
        onClick={() => router.push("/interview-skill-category")}
      >
         View Interview Skill Category
      </Button>
      <form onSubmit={details.onSubmit(fetchQuestion)}>
        <Autocomplete
          disabled={responses.loading}
          radius="xl"
          size="md"
          my="md"
          data={InterviewTopics.map((t) => t.label)}
          {...details.getInputProps("type")}
          icon={<FaSearch size={18} />}
          rightSection={
            responses.loading ? (
              <Loader />
            ) : (
              <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled" type="submit">
                <FaArrowRight />
              </ActionIcon>
            )
          }
        />
        <Radio.Group label="Difficulty Level" {...details.getInputProps("difficulty")}>
          <Radio value="1" label="1" />
          <Radio value="2" label="2" />
          <Radio value="3" label="3" />
          <Radio value="4" label="4" />
          <Radio value="5" label="5" />
        </Radio.Group>
      </form>
      {responses.questions !== null && responses.questions.length === 0 && <Alert my="md">No Questions found</Alert>}
      {responses.questions !== null &&
        responses.questions.length > 0 &&
        responses.questions.map((question) => (
          <QuestionCard question={question} key={question.id} onDelete={deleteQuestion} />
        ))}
    </Container>
  );
};

export default QuestionData;
