
import { useForm } from "@mantine/form";
import React, { useCallback, useState } from "react";

import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";

import { alerts } from "../utils/alert-utils";
import styles from "../styles/questionAdd.module.css";
import { getPartyLsitCount, sendEmployerData, showEmployerResults } from "../apis/mycvtracker";
import { sendAssignInterview } from "../apis/mycvtracker";
import { Empdata } from "../types/question_types";
import { Group, Pagination } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

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
} from "@mantine/core";


const JobDetails = () => {
  const { showErrorToast, showSuccessToast } = useToast();
  const { token } = useUserState();
  const [isLoading, setIsLoading] = useState(false);
  const [addEmployer, setaddEmployer] = useState(false);
  const [showEmployer, setshowEmployer] = useState(false);
  //const theme = useMantineTheme();
  const [response, setResponses] = useState({ loading: false, data: null as Empdata[] | null });
  const [search, setSearch] = useState('');
  const [partyLength, setPartyLength] = useState(1);
  // const [partyLength, setPartyLength] = useState(3);
  // const [listCount, setListCount] = useState({ loading: false, data: [] });
  

  const details = useForm({
    initialValues: {
        jobTittle: "",
        jobLink: "",
        mycvTrackerLink: "",
        employerName: "",
        uploadAudio: "",
    },
    validate: {
        jobTittle: (value) => (value.length <= 1 ? "Job  tittle cannot be empty" : null),
        jobLink: (value) => (value.length <= 4 ? "Invalid Link" : null),
        mycvTrackerLink: (value) => (value.length <= 4 ? "Invalid Link" : null),
        // employerName: (value) => (value.length <= 1 ? "Name  cannot be empty" : null),
        // uploadAudio: (value) => (value.length <= 1 ? "Headquarters  cannot be empty" : null),
    },
  });

  type FormType = typeof details.values;

  const showEmployerData = async () => {
    setshowEmployer(true);
    setaddEmployer(false);
    try {
      const partyLength = await getPartyLsitCount(token,"EMPLOYER",search);
      //console.log(listCount);
     // setListCount({ data: listCount.data, loading: false });
      setPartyLength(Math.ceil(partyLength.data.noRecords/10));
    } catch (e) { }
    try {
      setResponses((prev) => ({ ...prev, loading: true }));
      const response = await showEmployerResults(token, 1, 10,'EMPLOYER',search);
      setResponses({ data: response.data, loading: false });
    } catch (e) { }
  };

  const addEmployerData = () => {
    setaddEmployer(true);
    setshowEmployer(false);
  }

  const handleFormSubmit = useCallback(
    async (values: FormType) => {
      // return console.log(values.interviewType.map((t) => `${t.value}${t.level[0]}${t.level[1]}`).join("_"));
      try {
        setIsLoading(true);
        //await sendEmployerData({ ...values }, token);
        showSuccessToast("Added Employer data successfully");
        setaddEmployer(false);
      } catch (e: any) {
        console.log(e);
        if (alerts[e.response.status]) showErrorToast(alerts[e.response.status].message);
        else showErrorToast("Encountered Some Error");
      } finally {
        setIsLoading(false);
      }
    },
    [token, showErrorToast, showSuccessToast]
    // }
  );

  const handlePagination = async (data: any) => {

    let selected = data;
    let offset = 10;
    try {
      const response = await showEmployerResults(token, selected, offset,'EMPLOYER',search);
      setResponses({ data: response.data, loading: false });
    } catch (e) { }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    // setSearch( event.currentTarget.value);
    setSearch(value);
    //setSortedData({  search: value });

  };
  return (
    <Container>
      <Title order={1} className={styles.mtop}> Job Details Data</Title>
      <Button type="submit" variant="filled" my="sm" onClick={addEmployerData}>
        Add Job Details
      </Button>
      <Button
        type="button"
        variant="filled"
        m="sm"
        onClick={showEmployerData}
        disabled={isLoading}
        loading={isLoading}
      >
        Display Job Details
      </Button>
      {addEmployer && <Paper p="md" my="md">
        <form onSubmit={details.onSubmit(handleFormSubmit)}>

          <TextInput
            placeholder="Job Tittle"
            label="Job Tittle"
            withAsterisk
            {...details.getInputProps("jobTittle")}
          />
          <TextInput
            placeholder="Job Link"
            label="Job Link"
            withAsterisk
            {...details.getInputProps("jobLink")}
          />
          <TextInput
            placeholder="MycvTrackerL ink"
            label="MycvTracker Link"
            withAsterisk
            {...details.getInputProps("mycvTrackerLink")}
          />
          <TextInput
            placeholder="employer Name"
            label="employer Name"
           
            {...details.getInputProps("employerName")}
          />
          {/* <TextInput
            placeholder="Upload Audio"
            label="Upload Audio"
      
            {...details.getInputProps("UploadAudio")}
          /> */}
          {/* <TextInput placeholder="website Link" label="Website Link" withAsterisk {...details.getInputProps("website")} /> */}
          <Button type="submit" variant="filled" my="sm">
            ADD
          </Button>

        </form>
      </Paper>
      }
      {showEmployer && 
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      //onChange={handleSearchChange}//{(e) => setSearchedVal(e.target.value)}
      />
      // <input type="text" onChange={(e) => setSearch(e.target.value)} id="simple-search" placeholder="Search" />
              
      }

      {showEmployer &&
        <div className={styles.members_wrapper}>
          <table className={styles.members_table}>
            <thead>
              <tr>
                <th>Job Tittle</th>
                <th>Job Link  </th>
                <th>MycvTracker Link </th>
                <th>Employer Name</th>
                <th>Audio</th>
              </tr>
            </thead>
            <tbody>
              {

                response.data !== null &&
                response.data.length > 0 &&
                // response.data.map((member) => (
                response.data.filter((row) =>
                  search.length < 3 || (row.name !== null && row.name.length > 0)
                    .toString()
                    .toLowerCase()
                    .includes(search.toString().toLowerCase())
                )
                  .map((member) => (
                    <tr key={member.id}>
                      <td className={styles.candidate_email}>{member.name}</td>
                      <td>{member.companySize}</td>
                      <td>{member.industry}</td>
                      <td className={styles.token_break1}>{member.headquarter}</td>
                      <td className={styles.ellipsis1}><a href={member.website} target="_blank" rel="noreferrer">{member.website}</a></td>
                    </tr>
                  ))}


            </tbody>
          </table>
        </div>

      }
      {showEmployer && response.data !== null &&
        response.data.length > 0 &&
        <div className={styles.page}>
          <Pagination
            total={partyLength}
            position="center"
          onChange={handlePagination}
          />
        </div>
      }
    </Container>
 
  );
};

export default JobDetails;