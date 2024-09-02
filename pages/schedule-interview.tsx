import React, { useState, useCallback } from "react";

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
  Autocomplete,
} from "@mantine/core";
import { sendAssignInterview, sendSchduleInterview } from "../apis/mycvtracker";
// import { sendRemiderRequest } from "../apis/mycvtracker/assign-interview";
// import { EmployerData } from "../data/interview";
import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";
import { alerts } from "../utils/alert-utils";
import { useForm } from "@mantine/form";

// type thirdPartyId = {
//   value: string;
//   level: [number, number];
// };

const ScheduleInterviewPage = () => {
  const { token } = useUserState();
  const { showErrorToast, showSuccessToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const details = useForm({
    initialValues: {
      candidateName: "",
      invite: "",
      resultOwners: "",
      candidateEmail: "",
      jobLink: "",
      candidateList: "",
      calendlyLink : "",
      thirdPartyId: "",//[] as thirdPartyId[],
    },
    validate: {
      candidateEmail: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid Candidate Email"),
      candidateName: (value) => (value.length <= 1 ? "Candidate name cannot be empty" : null),
      jobLink: (value) => (value.length < 4 ? "Invalid Job Link" : null),
      calendlyLink: (value) => (value.length < 4 ? "Invalid calendly Link" : null)

    },
  });

  type FormType = typeof details.values;

 

  const handleFormSubmit = useCallback(
    async (values: FormType) => {
      // return console.log(values.interviewType.map((t) => `${t.value}${t.level[0]}${t.level[1]}`).join("_"));
      try {
        setIsLoading(true);
        await sendSchduleInterview({...values},token);
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
  // const handleMultiSelect = (e: string[]) => {
  //   let curr = details.values.thirdPartyId;
  //   let currValues = curr.map((t) => t.value);
  //   curr = curr.filter((type) => e.includes(type.value));

  //   let newTypes = e.filter((t) => !currValues.includes(t));  

  //   details.setFieldValue("thirdPartyId", [
  //     ...curr,
  //     ...newTypes.map((t) => ({ value: t, level: [0, 1] as [number, number] })),
  //   ]);
  // };


  // const handleSendReminder = useCallback(
  //   async (values: FormType) => {
  //     try {
  //       setIsLoading(true);
  //       console.log('values....'+values);
  //       await sendRemiderRequest({ ...values}, token);
  //       showSuccessToast("Your Request has been submitted");
  //     } catch (e: any) {
  //       console.log(e);
  //       if (alerts[e.response.status]) showErrorToast(alerts[e.response.status].message);
  //       else showErrorToast("Encountered Some Error");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [token, showErrorToast, showSuccessToast]
  // );

  return (
    <Container>
      <Title order={1}>Schedule Interview</Title>
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
         

            <TextInput placeholder="Job Link" label="Job Link" withAsterisk {...details.getInputProps("jobLink")} />
            <TextInput placeholder="Calendly Link" label="Calendly Link" withAsterisk {...details.getInputProps("calendlyLink")} />
            {/* <MultiSelect
              data={EmployerData}
              label="Employer Name"
              placeholder="Select Company Name"
              //value={details.values.thirdPartyId.map((type) => type.value)}
              value={details.values.thirdPartyId.map((type: { value: any; }) => type.value)}
              onChange={handleMultiSelect}
            /> */}
           
            <TextInput placeholder="Employer Name" label="Employer Name"  {...details.getInputProps("thirdPartyId")} />
            <Button type="submit" variant="filled" my="sm" disabled={isLoading} loading={isLoading}>
             Schedule Interview
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

export default ScheduleInterviewPage;
