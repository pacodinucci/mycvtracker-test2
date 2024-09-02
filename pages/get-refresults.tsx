import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { Container, Button, TextInput, Title, Select } from "@mantine/core";
import { useScrollIntoView } from '@mantine/hooks';

import { deleteCandidate, getCandidateLsitCount, sendGetCandidateResult, showThirdParties } from "../apis/mycvtracker";
import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";
import { CandidateResultRequest } from "../types/assignInterview_types";
import { alerts } from "../utils/alert-utils";
import styles from "../styles/questionAdd.module.css";
import { getInterviewResults } from "../apis/mycvtracker";
import { useRouter } from "next/router";
import { AudioResponse } from "../types/audioResponse_types";
import { getInterviewResponses } from "../apis/mycvtracker";
import PrevResponse from "../components/PrevResponse";
import { Pagination } from '@mantine/core';
import { Candidatedata, Empdata } from "../types/question_types";
import { IconSearch } from '@tabler/icons-react';
import moment from 'moment/moment';
import { useDebounce } from "../hooks/useDebounce";
import { sendRefAssignInterview, sendRemiderRequest } from "../apis/mycvtracker/assign-interview";
import { sendAssignInterview } from "../apis/mycvtracker";
import { useForm } from "@mantine/form";
import {
  NumberInput,
  MultiSelect,
  Paper,
  RangeSlider,
  Stack,
  Box,
  Text,
  Flex,
} from "@mantine/core";
import { InterviewSkillCategory } from "../types/interview_skill_category_type";
import { getInterviewSkillCategories } from "../apis/mycvtracker/interview-skill-catogory";
import { toInterviewTopics } from "../utils/interview-skill-category-utils";


type InputValuesError = {
  candidateName: string;
  candidate: string;
  jobLink: string;
  token: string;
};

type InterviewType = {
  value: string;
  level: [number, number];
};


const GetRefResults = () => {
  const { token } = useUserState();
  const router = useRouter();
  const pageCount = useRef(0);
  const { showErrorToast, showSuccessToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponses] = useState({ loading: false, data: null as Candidatedata[] | null });
  const [results, setResults] = useState<{ data: AudioResponse[]; loading: boolean }>({ data: [], loading: false });
  const [emailResponce, setemailResponce] = useState({ loading: false, resdata: [] });
  const [listCount, setListCount] = useState({ loading: false, data: [] });
  const [search, setSearch] = useState('');
  const [partyLength, setPartyLength] = useState(1);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const [delRes, setDelRes] = useState({ data: {} });
  const [pageDel, setPagedel] = useState();
  const [addEmployer, setaddEmployer] = useState(false);
  const [showEmployer, setshowEmployer] = useState(false);
  const [thirdParties, setThirdPaties] = useState<Empdata[]>([]);

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
      jobLink: "",
      candidateList: "",
      referralId: 0,
      type:"REFERRAL"
    },
    validate: {
      candidateEmail: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid Candidate Email"),
      resultOwners: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid Owner Email"),
      candidateName: (value) => (value.length <= 1 ? "Candidate name cannot be empty" : null),
      //   jobLink: (value) => (value.length < 4 ? "Invalid Job Link" : null),
      interviewType: (value) => (value.length < 1 ? "Select atleast 1 topic" : null),
      // date: (value) => (value.length < 8 ? "Entervalid date" : null),
    },
  });
  const fetchThirdParties =
  useCallback(async (search: string|null = "") => {
    if(token){
      const response = await showThirdParties(token, 1, 30, search|| '', 'REFERRAL');
      setThirdPaties(response.data);
    }
  }, [token])
  const addEmpAssInterview = () => {
    setaddEmployer(true);
    setshowEmployer(false);
    fetchThirdParties();
  }
  const getResultByEmail =  //useCallback(
    async (values: CandidateResultRequest) => {
      if (window.confirm("Are you sure you want get candidate results by email") === true) {
        try {
          setIsLoading(true);
          await sendGetCandidateResult(values, token);
          showSuccessToast("Your Request has been submitted");
        } catch (e: any) {
          console.log(e);
          if (alerts[e.response.status]) showErrorToast(alerts[e.response.status].message);
          else showErrorToast("Encountered Some Error");
        } finally {
          setIsLoading(false);
        }
      }
    }
  //,[token, showErrorToast, showSuccessToast]
  //);

  const getAllResults = React.useCallback(
    async () => {
      setshowEmployer(true);
      setaddEmployer(false);
      try {
        const listCount = await getCandidateLsitCount(token,"REFERRAL", search);
        setListCount({ data: listCount.data.noRecords, loading: false });
        setPartyLength(Math.ceil(listCount.data.noRecords / 10));
      } catch (e) { }
      try {
        // setResponses((prev) => ({ ...prev, loading: true }));
        const response = await getInterviewResults(token, 1, 10,"REFERRAL", search);
        setResponses({ data: response.data, loading: false });
      } catch (e) { }
    },
    [search, token],
  )

  const debounceGetAllResults = useDebounce(getAllResults, 500);
  const debounceFetchThirdParties = useDebounce(fetchThirdParties, 500);

  const handleOnChange = useCallback(

    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      debounceGetAllResults();
      try {
        const listCount = await getCandidateLsitCount(token, "REFERRAL",search);
        setListCount({ data: listCount.data.noRecords, loading: false });
        setPartyLength(Math.ceil(listCount.data.noRecords / 10));
      } catch (e) { }
    },
    [debounceGetAllResults],

  )

  //get Candidate details onload page
  useEffect(() => {
     getAllResults();
  }, []);

  const skipAssignEmp = () => {
    getAllResults();
  }

  const getInterviewResponce = async (token: any) => {
    try {
      setResults((prev) => ({ ...prev, loading: true }));
      const results = await getInterviewResponses(token);
      setResults({ data: results.data, loading: false });
      if (results.data.length == 0) {
        showErrorToast("Candidate has not finished the interview assignment yet!");
      } else {
        scrollIntoView({ alignment: 'center', })
      }
    } catch (e) { }
  }

  useEffect(() => {
    if (router.query.token) {
      if (!Array.isArray(router.query.token)) {
        getInterviewResponce({ token: router.query.token });
        router.replace(router.asPath, router.route, { shallow: true });
      }
    }
  }, [router, getInterviewResponce]);

  //const handlePpage = async (data: { selected: any; }) => {
  const handlePagination = async (data: any) => {
    let selected = data;
    setPagedel(selected);
    let offset = 10;//Math.ceil(selected * this.props.perPage);

    try {
      const response = await getInterviewResults(token, selected, offset,"REFERRAL", search);
      setResponses({ data: response.data, loading: false });

    } catch (e) { }
  };


  const handleDelete = async (candToken: string) => {
    if (window.confirm("Are you sure you want delete the record?") === true) {
      try {
        const delRes = await deleteCandidate(candToken, token);
        setDelRes({ data: delRes.status });
        handlePagination(pageDel);
        if (delRes.status == 200)
          showSuccessToast("Deleted Candidate successfully");

      } catch (e) { }
    }
  }

  const handleSendReminder = async (canToken: string) => {
    const candToken = {
      "token": canToken
    }
    if (window.confirm("Are you sure you want send remainder email to Candidate?") === true) {
      try {
        await sendRemiderRequest(candToken, token);
        showSuccessToast("Your Request has been submitted");
      } catch (e) {
        showErrorToast("Encountered Some Error");
      }
    }
  }

  const getAllResultsONSelection = (e: any, canToken: string) => {
    if (e === "Get Response") {
      getInterviewResponce(canToken);
    } else if (e === "Get Result By Email") {
      getResultByEmail({ "token": canToken });
    }
    else if (e === "Send Reminder Interview") {
      handleSendReminder(canToken);
    }
    else if (e === "Delete") {
      handleDelete(canToken);
    }
  }
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
  /* Add Employer Assign Interview*/
  const handleFormSubmit = useCallback(
    async (values: FormType) => {
      // return console.log(values.interviewType.map((t) => `${t.value}${t.level[0]}${t.level[1]}`).join("_"));
      try {
        setIsLoading(true);
        await sendRefAssignInterview(
          {
            ...values,
            interviewType: values.interviewType.map((t) => `${t.value}${t.level[0]}${t.level[1]}`).join("_"),
          },
          token
        );
        showSuccessToast("Your Request has been submitted");
        getAllResults();
      } catch (e: any) {
        if (alerts[e.response.status]) showErrorToast(alerts[e.response.status].message);
        else showErrorToast("Encountered Some Error");
      } finally {
        setIsLoading(false);
      }
    },
    [token, showErrorToast, showSuccessToast]
  );
  const handleChangeReferral = (value: string) => {
    details.setFieldValue("referralId", +value);
  };


  return (
    <Container>
      <Title>Add/Get Referral Interviews</Title>

      <Button type="submit" variant="filled" my="sm" disabled={isLoading} loading={isLoading} onClick={addEmpAssInterview}>
        Assign Interview
      </Button>
      {showEmployer && <div>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          className={styles.search_top}
          icon={<IconSearch size="0.9rem" stroke={1.5} />}
          value={search}
          onChange={handleOnChange}
        //onChange={handleSearchChange}//{(e) => setSearchedVal(e.target.value)}
        />

        <div className={styles.members_wrapper}>
          <table className={styles.members_table}>
            <thead>
              <tr>
                <th>Name </th>
                <th className={styles.hideCol__xs}>Email</th>
                <th>Skills</th>
                <th className={styles.hideCol__xs}>Assigned On</th>
                <th>Interviewed On</th>
                {/* <th>Token</th> */}
                <th className={styles.hideCol__xs}>Referral Name</th>
                {/* <th>Get Result By Email</th>
              <th>Get Responce</th>
              <th>Delete</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                response.data !== null &&
                response.data.length > 0 &&
                response.data
                  .map((member) => (
                    // response.data.map((member) => (
                    <tr key={member.id}>
                      <td className={styles.token_break1}>{member.candidateName}</td>
                      <td className={styles.candidate_email}>{member.candidate}</td>

                      <td className={styles.token_break}>{member.interviewType}</td>
                      <td className={styles.hideCol__xs}>{member.createdAt ? moment(member.createdAt).format("DD/MM/YYYY hh:mm") : ''}</td>
                      <td>{member.completedAt ? moment(member.completedAt).format("DD/MM/YYYY hh:mm") : ''}</td>
                      {/* <td>{(member.completedAt)}</td>  */}
                      {/* <td >{member.token}</td> */}
                      <td className={styles.ellipsis}><a href={member.jobLink} target="_blank" rel="noreferrer"></a></td>
                      {/* <td><Button type='button' className={styles.create_uuid} onClick={() => getResultByEmail({ "token": member.token })}>Get Result By Email</Button></td>
                    <td><Button type='button' className={styles.create_uuid} onClick={() => getInterviewResponce(member.token)}>Get Responce</Button></td>
                    <td><button type='button' className={styles.delete_btn} onClick={() => { handleDelete(member.token); }}>
                      <svg className={styles.svg_icon} viewBox="0 0 20 20" >
                        <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306" fill="#FFFFFF" />
                      </svg>
                    </button></td> */}
                      <td>
                        <Select
                          placeholder="Select"
                          data={[
                            { value: 'Get Result By Email', label: 'Get Result By Email' },
                            { value: 'Get Response', label: 'Get Response' },
                            { value: 'Send Reminder Interview', label: 'Send Reminder Interview' },
                            { value: 'Delete', label: 'Delete' },
                          ]}
                          onChange={(e) => getAllResultsONSelection(e, member.token)}
                        />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>


        {
          response.data !== null &&
          response.data.length > 0 &&
          <div ref={targetRef} className={styles.page}>
            <Pagination
              total={partyLength}
              position="center"
              onChange={handlePagination}
            />
          </div>
        }

        <div className={styles.respmtop}>
          {results.loading && <p>Loading</p>}
          {/* {!results.loading && results.data.length === 0 && <Alert mt="md">Wrong token or no response</Alert>} */}
          {!results.loading &&
            results.data.length > 0 &&
            results.data.map((response) => <PrevResponse data={response} key={response.questionId} />)}
        </div>
      </div>
      }

      {addEmployer && <Paper p="md" my="md">
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
            {/* <TextInput placeholder="Job Link" label="Job Link" withAsterisk {...details.getInputProps("jobLink")} /> */}

            <Select
                    mt={10}
                      data={thirdParties.map((item) => ({
                        value: `${item.id}`,
                        label: item.name,
                      }))}
                      label="Referral Name"
                      searchable
                      nothingFound="No Referral Found"
                      placeholder="Select Referral Name"
                      withAsterisk
                      filter={() => true}
                      error={details.errors?.referralId || ""}
                      onChange={handleChangeReferral}
                      onSearchChange={(search) => {
                        debounceFetchThirdParties(search,'EMPLOYER');
                      }}
                    />
            {/* <TextInput placeholder="dd/mm/yyyy" label="Deadline"  {...details.getInputProps("date")} /> */}
            <Button type="submit" variant="filled" my="sm" disabled={isLoading} loading={isLoading}>
              Assign
            </Button>
            <Button type="submit" variant="filled" my="sm" className={styles.skip_emp} onClick={skipAssignEmp}>
            Cancel
          </Button>
          </>
        </form>
      </Paper>
      }


    </Container>


  );
};

export default GetRefResults;
