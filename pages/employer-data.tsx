
import { useForm } from "@mantine/form";
import React, { useCallback, useEffect, useState } from "react";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { GetQuestionsList } from "../apis/mycvtracker/questions";
import QuestionCard from "../components/QuestionCard";
import { RecruiterParty } from "../data/interview";
import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";
import { Question } from "../types/question_types";
import { alerts } from "../utils/alert-utils";
import styles from "../styles/questionAdd.module.css";
import { deleteEmployer, getPartyLsitCount, sendEmployerData, showEmployerResults } from "../apis/mycvtracker";
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
  Select,
} from "@mantine/core";
import { useDebounce } from "../hooks/useDebounce";


const EmployerData = () => {
  const { showErrorToast, showSuccessToast } = useToast();
  const { token } = useUserState();
  const [isLoading, setIsLoading] = useState(false);
  const [addEmployer, setaddEmployer] = useState(false);
  const [showEmployer, setshowEmployer] = useState(false);
  //const theme = useMantineTheme();
  const [response, setResponses] = useState({ loading: false, data: null as Empdata[] | null });
  const [search, setSearch] = useState('');
  const [partyLength, setPartyLength] = useState(1);
  const [delRes, setDelRes] = useState({ data: {} });
  const [pageDel, setPagedel] = useState();
  // const [partyLength, setPartyLength] = useState(3);
  // const [listCount, setListCount] = useState({ loading: false, data: [] });


  const details = useForm({
    initialValues: {
      name: "",
      email: "",
      companySize: "",
      industry: "",
      headquarter: "",
      website: "",
      type:"EMPLOYER"
    },
    validate: {
      name: (value) => (value.length <= 1 ? "Company name cannot be empty" : null),
      email: (value) => (value.length <= 1 ? "Emaile cannot be empty" : null),
      companySize: (value) => (value.length <= 1 ? "Company size cannot be empty" : null),
      industry: (value) => (value.length <= 1 ? "Industry  cannot be empty" : null),
      headquarter: (value) => (value.length <= 1 ? "Headquarters  cannot be empty" : null),
      website: (value) => (value.length < 4 ? "Invalid websiteLink Link" : null)
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
      setPartyLength(Math.ceil(partyLength.data.noRecords / 10));
    } catch (e) { }
    try {
      setResponses((prev) => ({ ...prev, loading: true }));
      const response = await showEmployerResults(token, 1, 10,'EMPLOYER',search);
      setResponses({ data: response.data, loading: false });
    } catch (e) { }
  };


  const debouncedshowEmployerData = useDebounce(showEmployerData, 500);

  const addEmployerData = () => {
    setaddEmployer(true);
    setshowEmployer(false);
  }

  const handleOnChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      debouncedshowEmployerData();
      try {
        const partyLength = await getPartyLsitCount(token,"EMPLOYER",search);
        setPartyLength(Math.ceil(partyLength.data.noRecords / 10));
      } catch (e) { }
    },
    [debouncedshowEmployerData],
  )

  const handleFormSubmit = useCallback(
    async (values: FormType) => {
      try {
        setIsLoading(true);
        await sendEmployerData({ ...values }, token);
        showSuccessToast("Added Employer data successfully");
        setaddEmployer(false);
        showEmployerData();
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
    setPagedel(selected);
    let offset = 10;
    try {
      const response = await showEmployerResults(token, selected, offset,'EMPLOYER', search);
      setResponses({ data: response.data, loading: false });
    } catch (e) { }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    // setSearch( event.currentTarget.value);
    setSearch(value);
    //setSortedData({  search: value });
  };
  useEffect(() => {
    showEmployerData();
  }, []);

  const skipEmployer = () => {
    showEmployerData();
  }
  const handleDelete = async (candToken: number) => {
    if (window.confirm("Are you sure you want delete the record?") === true) {
      try {
        const delRes = await deleteEmployer(candToken, token);
        setDelRes({ data: delRes.status });
        handlePagination(pageDel);
        if (delRes.status == 200)
          showSuccessToast("Deleted Candidate successfully");

      } catch (e) { }
    }
  }
  const addFile = (e: any) => {
    if (e.target.files[0]) {
      // setAudio(URL.createObjectURL(e.target.files[0]));
    }
  };
  // const handleChangeSelect = (value: string) => {
  //   newInterviewSharing.setFieldValue("thirdPartyId", +value);
  // };
  return (
    <Container>
      <Title order={1} className={styles.mtop}> Employer Data</Title>
      <Button type="submit" variant="filled" my="sm" onClick={addEmployerData}>
        Add Employer
      </Button>
      {/* <Button
        type="button"
        variant="filled"
        m="sm"
        onClick={showEmployerData}
        disabled={isLoading}
        loading={isLoading}
      >
        Show Employer Data
      </Button> */}
      {addEmployer && <Paper p="md" my="md">
        <form onSubmit={details.onSubmit(handleFormSubmit)}>

          <TextInput
            placeholder="Company Name"
            label="Company Name"
            withAsterisk
            {...details.getInputProps("name")}
          />
          <TextInput
            placeholder="Company Email"
            label="Company Email"
            withAsterisk
            {...details.getInputProps("email")}
          />
          <TextInput
            placeholder="Company size"
            label="Company size"
            withAsterisk
            {...details.getInputProps("companySize")}
          />
          <TextInput
            placeholder="Industry"
            label="Industry"
            withAsterisk
            {...details.getInputProps("industry")}
          />
          <TextInput
            placeholder="Headquarters"
            label="Headquarters"
            withAsterisk
            {...details.getInputProps("headquarter")}
          />
          <TextInput placeholder="website Link" label="Website Link" withAsterisk {...details.getInputProps("website")} />
          <TextInput
            placeholder="Type"
            label="Type"
            withAsterisk
            {...details.getInputProps("type")}
          />
          <>
          <div>Select audio file</div>
          <div className={styles.addfile}>
            <input type="file" onChange={addFile} />
          </div>
          </>
           {/* <Select
                    mt={10}
                      data={RecruiterParty.map((item) => ({
                        value: `${item.type}`,
                        label: item.type,
                      }))}
                      label="Employer Name"
                      searchable
                      nothingFound="No Party Found"
                      placeholder="Select Third Party"
                      withAsterisk
                      filter={() => true}
                      onChange={(e) =>
                        details.setFieldValue(
                          `type`,
                          e
                        )
                      }
                    />  */}

                      

          <Button type="submit" variant="filled" my="sm">
            ADD
          </Button>
          <Button type="submit" variant="filled" my="sm" className={styles.skip_emp} onClick={skipEmployer}>
            CANCEL
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
          onChange={handleOnChange}
        //onChange={handleSearchChange}//{(e) => setSearchedVal(e.target.value)}
        />
        // <input type="text" onChange={(e) => setSearch(e.target.value)} id="simple-search" placeholder="Search" />

      }

      {showEmployer &&
        <div className={styles.members_wrapper}>
          <table className={styles.members_table}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th className={styles.hideCol__xs}>Company Size </th>
                <th>Industry</th>
                <th>Headquarters</th>
                <th className={styles.hideCol__xs}>Website Link</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {

                response.data !== null &&
                response.data.length > 0 &&
                // response.data.map((member) => (
                response.data
                  .map((member) => (
                    <tr key={member.id}>
                      <td className={styles.candidate_email}>{member.name}</td>
                      <td className={styles.hideCol__xs}>{member.companySize}</td>
                      <td>{member.industry}</td>
                      <td className={styles.token_break1}>{member.headquarter}</td>
                      <td className={styles.ellipsis}><a href={member.website} target="_blank" rel="noreferrer">{member.website}</a></td>
                      <td><button type='button' className={styles.delete_btn} onClick={() => { handleDelete(member.id); }}>
                      <svg className={styles.svg_icon} viewBox="0 0 20 20" >
                        <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306" fill="#FFFFFF" />
                      </svg>
                    </button></td>
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
    /* // <Container>
    //   <Title order={1} className={styles.mtop}>About the company</Title>
    //   <div className={styles.card_container}>
    //   <div className={styles.card}>
    //     <div className={styles.compsize_text}>Company size</div>
    //     <div className={styles.compsize}>10 - 50</div>
    //   </div>
    //   <div className={styles.card_disgn}>
    //     <div className={styles.compsize_text}>Industry</div>
    //     <div className={styles.compsize}>Fintech</div>
    //   </div>
    //   <div className={styles.card_disgn}>
    //     <div className={styles.compsize_text}>Headquarters</div>
    //     <div className={styles.compsize}>London</div>
    //   </div>
    //   <div className={styles.card_disgn}>
    //     <div className={styles.compsize_text}>Link</div>
    //     <div className={styles.compsize}>mycvtracker.com</div>
    //   </div>
    //   </div>

    // </Container> */
  );
};

export default EmployerData;
