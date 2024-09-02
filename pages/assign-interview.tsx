import React, { useState, useCallback, useEffect, useMemo } from "react";

import {
  Container,
  Button,
  TextInput,
  NumberInput,
  MultiSelect,
  Title,
  Paper,
  RangeSlider,
  Stack,
  Box,
  Text,
  Flex,
  Radio,
  Group,
} from "@mantine/core";
import { sendAssignInterview } from "../apis/mycvtracker";
import { sendRemiderRequest } from "../apis/mycvtracker/assign-interview";
import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";
import { alerts } from "../utils/alert-utils";
import { useForm } from "@mantine/form";
import { InterviewMode } from "../types/assignInterview_types";
import { InterviewSkillCategory } from "../types/interview_skill_category_type";
import { getInterviewSkillCategories } from "../apis/mycvtracker/interview-skill-catogory";
import { toInterviewTopics } from "../utils/interview-skill-category-utils";
// import { DateInput,DatePickerInput } from '@mantine/dates';

type InterviewType = {
  value: string;
  level: [number, number];
};

const AssignInterviewPage = () => {
  const { token } = useUserState();
  const { showErrorToast, showSuccessToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      candidateName: "",
      invite: "",
      resultOwners: "info@mycvtracker.com",
      candidateEmail: "",
      interviewType: [] as InterviewType[],
      noOfQuestions: "10",
      timeBetweenQuestions: 60,
      jobLink: "indeed.com",
      candidateList: "",
      deadline: "",
      interviewMode: "AUDIO"
    },
    validate: {
      candidateEmail: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid Candidate Email"),
      resultOwners: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid Owner Email"),
      candidateName: (value) => (value.length <= 1 ? "Candidate name cannot be empty" : null),
      jobLink: (value) => (value.length < 4 ? "Invalid Job Link" : null),
      interviewType: (value) => (value.length < 1 ? "Select atleast 1 topic" : null),
      timeBetweenQuestions : (value) => value < 1 ? "Invalid time between questions" : null
      // deadline: (value) => (value.length < 8 ? "Entervalid date" : null),
    },
  });

  type FormType = typeof details.values;

  const handleMultiSelect = (e: string[]) => {
    let curr = details.values.interviewType;
    let currValues = curr.map((t) => t.value);
    curr = curr.filter((type) => e.includes(type.value));

    let newTypes = e.filter((t) => !currValues.includes(t));
    details.setFieldValue("interviewType", [
      ...curr,
      ...newTypes.map((t) => ({ value: t, level: [0, 1] as [number, number] })),
    ]);
  };

  const handleFormSubmit = useCallback(
    async (values: FormType) => {
      // return console.log(values.interviewType.map((t) => `${t.value}${t.level[0]}${t.level[1]}`).join("_"));
      console.log("Submitting form with values:", values);
      try {
        setIsLoading(true);

        await sendAssignInterview(
          {
            ...values,
            interviewType: values.interviewType.map((t) => `${t.value}${t.level[0]}${t.level[1]}`).join("_"),
            employerId: 0
          },
          token
        );
        showSuccessToast("Your Request has been submitted");
      } catch (e: any) {
        console.log(e);
        if (alerts[e.response.status]) showErrorToast(alerts[e.response.status].message);
        else showErrorToast("Encountered Some Error");
      } finally {
        setIsLoading(false);
      }
    },
    [token, showErrorToast, showSuccessToast]
  );


  return (
    <Container>
      <Title order={1}>Assign Interview</Title>
      <Paper p="md" my="md">
        <form onSubmit={details.onSubmit(handleFormSubmit)}>
          <>
            <TextInput
              placeholder="Candidate Name"
              label="Candidate Name"
              withAsterisk
              {...details.getInputProps("candidateName")}
            />
            <TextInput
              placeholder="Candidate Email"
              label="Candidate Email"
              withAsterisk
              {...details.getInputProps("candidateEmail")}
            />
            <TextInput
              placeholder="Result Owners"
              label="Result Owner"
              // value={value}
              // onChange={(event) => setValue(event.currentTarget.value)}
              withAsterisk
              {...details.getInputProps("resultOwners")
              }
            />

            <Radio.Group
              my="xs"
              name="interviewMode"
              label="Select interview mode"
              {...details.getInputProps("interviewMode")}
              withAsterisk
            >
              <Group my="xs">
                {Object.entries(InterviewMode).map(([mode, label]) => <Radio key={mode} value={mode} label={label} />)}

              </Group>
            </Radio.Group>


            <MultiSelect
              data={InterviewTopics}
              label="Interview Topics"
              placeholder="Select atleast 1 topic"
              withAsterisk
              value={details.values.interviewType.map((type) => type.value)}
              onChange={handleMultiSelect}
            />
            <Box my="md">
              <Text fz="sm">Difficulty Levels</Text>
              <Stack px="md">
                {details.values.interviewType.map((type, index) => (
                  <Flex
                    key={type.value + "range"}
                    align={{ base: "start", md: "center" }}
                    my="sm"
                    gap={{ base: "xs", md: "md" }}
                    direction={{ base: "column", md: "row" }}
                  >
                    <Text fz="xs" style={{ width: "40%" }}>
                      {InterviewTopics.find((t) => t.value === type.value)?.label || type.value}
                    </Text>
                    <RangeSlider
                      value={details.values.interviewType[index].level}
                      step={1}
                      minRange={1}
                      size="lg"
                      style={{ width: "100%" }}
                      max={5}
                      onChange={(e) => details.setFieldValue(`interviewType.${index}.level`, e)}
                      marks={[
                        { value: 1, label: "1" },
                        { value: 2, label: "2" },
                        { value: 3, label: "3" },
                        { value: 4, label: "4" },
                        { value: 5, label: "5" },
                      ]}
                    />
                  </Flex>
                ))}
              </Stack>
            </Box>

            {/* <NumberInput label="Number of Question" withAsterisk {...details.getInputProps("noOfQuestions")} /> */}
            <TextInput label="Number of Question" withAsterisk {...details.getInputProps("noOfQuestions")} />
            <TextInput label="Time between questions" type="number" min={1} withAsterisk {...details.getInputProps("timeBetweenQuestions")} my="xs"/>
            <TextInput placeholder="Job Link" label="Job Link" withAsterisk {...details.getInputProps("jobLink")} />
            <TextInput placeholder="Employer Name" label="Employer Name"  {...details.getInputProps("employername")} />
            <TextInput placeholder="dd/mm/yyyy" withAsterisk label="Deadline"  {...details.getInputProps("date")} />
            {/* <DateInput
              valueFormat="DD/MM/YYYY HH:mm:ss"
              label="Date input"
              placeholder="Date input"
              maw={400}
              mx="auto"
            /> */}

            <Button type="submit" variant="filled" my="sm" disabled={isLoading} loading={isLoading}>
              Assign Interview
            </Button>
            {/* <Button
              type="button"
              variant="light"
              m="sm"
              onClick={() => details.onSubmit(handleSendReminder)()}
              disabled={isLoading}
              loading={isLoading}
            >
              Send Reminder Interview
            </Button> */}
          </>
        </form>
      </Paper>
    </Container>
  );
};

export default AssignInterviewPage;
