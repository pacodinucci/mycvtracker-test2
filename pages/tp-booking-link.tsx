import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Container,
  Button,
  Title,
  Paper,
  Textarea,
  Radio,
  TextInput,
  Group,
  MultiSelect,
  Box,
  Stack,
  Text,
  Flex,
  RangeSlider,
  Select,
  CopyButton,
  Code,
  Center,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useUserState } from "../hooks/useUserState";

import { Empdata, Question } from "../types/question_types";
import { useToast } from "../hooks/useToast";
import { InterviewMode } from "../types/assignInterview_types";
import { showThirdParties } from "../apis/mycvtracker";
import { useDebounce } from "../hooks/useDebounce";
import { InterviewSkillCategory } from "../types/interview_skill_category_type";
import { getInterviewSkillCategories } from "../apis/mycvtracker/interview-skill-catogory";
import { toInterviewTopics } from "../utils/interview-skill-category-utils";

type InterviewType = {
  value: string;
  level: [number, number];
};

const ThirdPartyBookingLink = () => {
  const [thirdParties, setThirdPaties] = useState<Empdata[]>([]);
  const [url, setUrl] = useState("");

  const { showSuccessToast, showErrorToast } = useToast();
  const { token } = useUserState();

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
      interviewType: [] as InterviewType[],
      noOfQuestions: 8,
      type: "EMPLOYER",
      interviewMode: "AUDIO",
      timeBetweenQuestions: 60,
      thirdPartyReferralId: 0,
      refCode: "",
    },
    validate: {
      interviewType: (value) =>
        value.length < 1 ? "Select atleast 1 topic" : null,
      timeBetweenQuestions: (value) =>
        value < 1 ? "Invalid time between questions" : null,
      thirdPartyReferralId: (value) =>
        value <= 0 ? "Select third party want to share" : null,
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

  const fetchThirdParties = useCallback(
    async (search: string | null = "", e: any) => {
      if (token) {
        const response = await showThirdParties(token, 1, 30, search || "", e);
        setThirdPaties(response.data);
      }
    },
    [token]
  );

  const debounceFetchThirdParties = useDebounce(fetchThirdParties, 500);

  useEffect(() => {
    fetchThirdParties("", "RECRUITER_PARTY");
  }, [fetchThirdParties]);

  const handleChangeTP = (value: string) => {
    details.setFieldValue("thirdPartyReferralId", +value);
  };

  const handleFormSubmit = useCallback(async (values: FormType) => {
    const {
      noOfQuestions,
      interviewMode,
      timeBetweenQuestions,
      interviewType,
      refCode = "",
      thirdPartyReferralId,
    } = values;

    const strInterviewType = interviewType
      .map((t) => `${t.value}${t.level[0]}${t.level[1]}`)
      .join("_");

    const params = new URLSearchParams();
    params.set(
      "skills",
      `TP_${noOfQuestions}_QT_${timeBetweenQuestions}_SK_${strInterviewType}`
    );
    params.set("interviewMode", interviewMode),
      params.set("thirdPartyReferralId", `${thirdPartyReferralId}`);
    if (refCode) {
      params.set("refCode", refCode);
    }

    const bookingURL = `${
      window.location.origin
    }/interview-app/bookinterview?${params.toString()}`;
    setUrl(bookingURL);
  }, []);

  return (
    <Container>
      <Title order={1}>Booking Slot Link</Title>
      <Paper p="md" my="md">
        <form onSubmit={details.onSubmit(handleFormSubmit)}>
          <>
            <Select
              mt={10}
              data={thirdParties.map((item) => ({
                value: `${item.id}`,
                label: item.name,
              }))}
              label="Third Party"
              searchable
              nothingFound="No Party Found"
              placeholder="Select Third Party"
              withAsterisk
              filter={() => true}
              error={details.errors?.thirdPartyReferralId || ""}
              onChange={handleChangeTP}
              onSearchChange={(search) => {
                debounceFetchThirdParties(search, "RECRUITER_PARTY");
              }}
            />

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

            <MultiSelect
              maxSelectedValues={2}
              data={InterviewTopics}
              label="Skills"
              placeholder="Please select maximum of two skills"
              error={details.errors?.interviewType || ""}
              onChange={handleMultiSelect}
              withAsterisk
              my="xs"
            />

            {/* <NumberInput label="Number of Question" withAsterisk {...details.getInputProps("noOfQuestions")} /> */}
            <TextInput
              label="Number of Question"
              withAsterisk
              {...details.getInputProps("noOfQuestions")}
            />
            <TextInput
              label="Time between questions"
              type="number"
              min={1}
              withAsterisk
              {...details.getInputProps("timeBetweenQuestions")}
              my="xs"
            />
            <TextInput
              placeholder="Referal Code"
              label="Referal Code"
              {...details.getInputProps("refCode")}
            />

            <Button type="submit" variant="filled" my="sm">
              Generate
            </Button>
          </>
        </form>

        {url && (
          <Flex
            mt="lg"
            gap="md"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
          >
            <Box>
              <CopyButton value={url}>
                {({ copied, copy }) => (
                  <Button color={copied ? "teal" : "yellow"} onClick={copy}>
                    {copied ? "Copied url" : "Copy url"}
                  </Button>
                )}
              </CopyButton>
            </Box>
            <Code block>
              <a target="blank" href={url}>{url}</a>
            </Code>
          </Flex>
        )}
      </Paper>
    </Container>
  );
};

export default ThirdPartyBookingLink;
