import { useForm } from "@mantine/form";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";
import { Question } from "../types/question_types";
import { alerts } from "../utils/alert-utils";
import styles from "../styles/questionAdd.module.css";
import {
  deleteEmployer,
  getPartyLsitCount,
  sendEmployerData,
  showEmployerResults,
} from "../apis/mycvtracker";

import { Empdata } from "../types/question_types";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { TimeInput } from '@mantine/dates';

import {
  Container,
  Button,
  TextInput,
  NumberInput,
  MultiSelect,
  Title,
  Paper,
  Modal,
  Radio,
  Group,
} from "@mantine/core";
import { bookInterviewSlots } from "../apis/mycvtracker/assign-interview";
import { InterviewMode } from "../types/assignInterview_types";
import { useRouter } from "next/router";
import { InterviewSkillCategory } from "../types/interview_skill_category_type";
import { getInterviewSkillCategories } from "../apis/mycvtracker/interview-skill-catogory";
import { toInterviewTopics } from "../utils/interview-skill-category-utils";

const BookInterview_slot = () => {
  const { showErrorToast, showSuccessToast } = useToast();
  const router = useRouter();
  const { token } = useUserState();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [queryParams, setQueryParams] = useState<URLSearchParams>(
    new URLSearchParams()
  );


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
      candidateEmail: "",
      mobile: "",
      location: "",
      skills: "",
      refCode: "",
      noOfQuestions: 8,
      timeBetweenQuestions: 60,
      thirdPartyReferralId: '',
      interviewMode: "AUDIO",
      refUserId: "" as string | null,
    },
    validate: {
      candidateName: (value) =>
        value.length <= 1 ? "Candidate name cannot be empty" : null,
      candidateEmail: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid Candidate Email",
      mobile: (value) =>
        value.length <= 9
          ? "Mobile number cannot be empty and enter 10 digits"
          : null,
      location: (value) =>
        value.length <= 2 ? "Location cannot be empty" : null,
      skills: (value) => (value.length < 1 ? "Select atleast 1 skill" : null),
    },
  });

  type FormType = typeof details.values;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQueryParams(params);

    router.replace(router.asPath, router.route, { shallow: true });

    // set value to form
    details.setFieldValue("skills", params.get("skills") ?? "");
    details.setFieldValue("refCode", params.get("refCode") ?? "");
    details.setFieldValue("refUserId", params.get("refUser") ?? null);
    details.setFieldValue(
      "interviewMode",
      params.get("interviewMode")?.toUpperCase() || "AUDIO"
    );
    details.setFieldValue( "thirdPartyReferralId", params.get("thirdPartyReferralId") ?? "");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = useCallback(
    async (values: FormType) => {
      try {
        setIsLoading(true);
        await bookInterviewSlots(
          {
            ...values,
          },
          token
        );

        // toggleCreateShareInterviewModal();
        showSuccessToast("Form Submitted successfully");
        details.reset();
      } catch (e: any) {
        console.log(e);
        if (alerts[e.response.status])
          showErrorToast(alerts[e.response.status].message);
        else showErrorToast("Encountered Some Error");
      } finally {
        setIsLoading(false);
      }
    },
    [token, showErrorToast, showSuccessToast]
  );

  const handleMultiSelect = (e: any) => {
    if (e.length <= 2) {
      let curr = details.values.skills;
      let skillset = "";
      e.length > 1
        ? e.map(
            (key: any, val: any) =>
              (skillset =
                val == 0 ? skillset + key + "01" : skillset + "_" + key + "01")
          )
        : e.map((key: any) => (skillset = skillset + key + "01"));
      details.setFieldValue("skills", skillset);
    }
  };

  const toggleCreateShareInterviewModal = () => {
    details.reset();
    setShowSuccess((prevState) => !prevState);
  };

  return (
    <Container>
      <Title order={1} className={styles.mtop}>{`${
        details.values.interviewMode === "AUDIO" ? "Audio" : "Multiple Choice"
      } Interview Request Form`}</Title>

      <div className={styles.mandate_fields}>All fields are mandatory </div>
      <Paper p="md" my="md">
        <form onSubmit={details.onSubmit(handleFormSubmit)}>
          <TextInput
            placeholder="Name"
            label="Name"
            my="xs"
            withAsterisk
            {...details.getInputProps("candidateName")}
          />
          <TextInput
            placeholder="Email"
            label="Email"
            my="xs"
            withAsterisk
            {...details.getInputProps("candidateEmail")}
          />
          <TextInput
            placeholder="Mobile Number"
            label="Mobile Number"
            my="xs"
            withAsterisk
            {...details.getInputProps("mobile")}
          />

          {!queryParams.has("skills") && !queryParams.has("interviewMode") && (
            <Radio.Group
              my="xs"
              name="interviewMode"
              label="Select interview mode"
              {...details.getInputProps("interviewMode")}
              withAsterisk
            >
              <Group my="xs">
                {Object.entries(InterviewMode).map(([mode, label]) => (
                  <Radio key={mode} value={mode} label={label} />
                ))}
              </Group>
            </Radio.Group>
          )}
  
          {!queryParams.has("skills") && (
            <>
              <MultiSelect
                maxSelectedValues={2}
                data={InterviewTopics}
                label="Skills"
                placeholder="Please select maximum of two skills"
                // value={details.values.skills}
                onChange={handleMultiSelect}
                withAsterisk
                my="xs"
              />
              <TextInput
                label="Number of Question"
                type="number"
                min={1}
                withAsterisk
                {...details.getInputProps("noOfQuestions")}
                my="xs"
              />
              <TextInput
                label="Time between questions"
                type="number"
                min={1}
                withAsterisk
                {...details.getInputProps("timeBetweenQuestions")}
                my="xs"
              />
            </>
          )}

          <TextInput
            label="Current Location"
            placeholder="Current place of working (City/Country)"
            withAsterisk
            my="xs"
            {...details.getInputProps("location")}
          />
          <Button
            type="submit"
            variant="filled"
            my="sm"
            disabled={isLoading}
            loading={isLoading}
          >
            Submit
          </Button>
        </form>
      </Paper>

      <Modal
        opened={showSuccess}
        onClose={toggleCreateShareInterviewModal}
        title=""
      >
        <div className={styles.suscss_model}>Form Submitted Successfully</div>
      </Modal>
    </Container>
  );
};

export default BookInterview_slot;
