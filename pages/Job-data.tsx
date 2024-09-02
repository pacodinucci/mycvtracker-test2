
import { useForm } from "@mantine/form";
import React, { useCallback, useEffect, useState } from "react";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { GetQuestionsList } from "../apis/mycvtracker/questions";
import QuestionCard from "../components/QuestionCard";
import { RecruiterParty } from "../data/interview";
import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";
import { Empdata, Question } from "../types/question_types";
import { alerts } from "../utils/alert-utils";
import styles from "../styles/questionAdd.module.css";
import { deleteEmployer, getPartyLsitCount, sendEmployerData, showEmployerResults, showThirdParties } from "../apis/mycvtracker";
import { sendAssignInterview } from "../apis/mycvtracker";
import { Recruiterparty } from "../types/question_types";
import { Group, Input, Pagination } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

import {
  Container,
  Button,
  TextInput,
  Title,
  Paper,

  Select,
} from "@mantine/core";
import { useDebounce } from "../hooks/useDebounce";
import { sendRecuuiterData } from "../apis/mycvtracker/assign-interview";


const ThirdParty = () => {
  const { showErrorToast, showSuccessToast } = useToast();
  const { token } = useUserState();
  const [isLoading, setIsLoading] = useState(false);
  const [addEmployer, setaddEmployer] = useState(false);
  const [showEmployer, setshowEmployer] = useState(false);
  const [response, setResponses] = useState({ loading: false, data: null as Recruiterparty[] | null });
  const [search, setSearch] = useState('');
  const [partyLength, setPartyLength] = useState(1);
  const [delRes, setDelRes] = useState({ data: {} });
  const [pageDel, setPagedel] = useState();
  const [thirdParties, setThirdPaties] = useState<Empdata[]>([]);
  const [audio, setAudio] = useState();


  const details = useForm({
    initialValues: {
      employerId: 0,
      website: "",
      audio: ""
    },
    validate: {
      website: (value) => (value.length < 4 ? "Invalid websiteLink Link" : null)
    },
  });

  type FormType = typeof details.values;


  const showEmployerData = async () => {
    setshowEmployer(true);
    setaddEmployer(false);
    try {
      const partyLength = await getPartyLsitCount(token, "RECRUITER_PARTY", search);
      setPartyLength(Math.ceil(partyLength.data.noRecords / 10));
    } catch (e) { }
    try {
      setResponses((prev) => ({ ...prev, loading: true }));
      const response = await showEmployerResults(token, 1, 10, "RECRUITER_PARTY", search);
      setResponses({ data: response.data, loading: false });
    } catch (e) { }
  };
  const fetchThirdParties =
    useCallback(async (search: string | null = "") => {
      if (token) {
        const response = await showThirdParties(token, 1, 30, search || '', 'EMPLOYER');
        setThirdPaties(response.data)
      }
    }, [token])

  const debouncedshowEmployerData = useDebounce(showEmployerData, 500);

  const addEmployerData = () => {
    setaddEmployer(true);
    setshowEmployer(false);
    fetchThirdParties();
  }

  const handleOnChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      debouncedshowEmployerData();
      try {
        const partyLength = await getPartyLsitCount(token, "RECRUITER_PARTY", search);
        setPartyLength(Math.ceil(partyLength.data.noRecords / 10));
      } catch (e) { }
    },
    [debouncedshowEmployerData],
  )

  const handleFormSubmit = useCallback(
    async (values: FormType) => {
      try {
        setIsLoading(true);
        await sendRecuuiterData({
          ...values,
          name: "",
          email: ""
        }, token);
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
      const response = await showEmployerResults(token, selected, offset, "RECRUITER_PARTY", search);
      setResponses({ data: response.data, loading: false });
    } catch (e) { }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    setSearch(value);

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
  const handleChangeEmp = (value: string) => {
    details.setFieldValue("employerId", +value);
  };
  const addFile = (e: any) => {
    if (e.target.files[0]) {
      // setAudio(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Container>
      <Title order={1} className={styles.mtop}> Audio Data</Title>
      <Button type="submit" variant="filled" my="sm" onClick={addEmployerData}>
        Add Details
      </Button>

      {addEmployer && <Paper p="md" my="md">
        <form onSubmit={details.onSubmit(handleFormSubmit)}>

          <Select
            mt={10}
            data={thirdParties.map((item) => ({
              value: `${item.id}`,
              label: item.name,
            }))}
            label="Employer Name"
            searchable
            nothingFound="No Employer Found"
            placeholder="Select Employer Name"
            withAsterisk
            filter={() => true}
            error={details.errors?.employerId || ""}
            onChange={handleChangeEmp}
            onSearchChange={(search) => {
              fetchThirdParties(search);
            }}
          />


          <TextInput placeholder="Job Link" label="Job Link" withAsterisk {...details.getInputProps("website")} />

          {/* <TextInput
            placeholder="Upload Audio File"
            label="Upload Audio File"
            type="file"
            withAsterisk
            onChange={addFile} 
          /> */}
          <div className={styles.addfile}>
          <div>Select audio file</div>
            <input type="file" onChange={addFile} />
          </div>
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
        />

      }

      {showEmployer &&
        <div className={styles.members_wrapper}>
          <table className={styles.members_table}>
            <thead>
              <tr>
                <th> Name</th>
                {/* <th>Email </th> */}
                <th >Job Link</th>
                <th >Audio</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {

                response.data !== null &&
                response.data.length > 0 &&
                response.data
                  .map((member) => (
                    <tr key={member.id}>
                      <td className={styles.candidate1_email}>{member.name}</td>
                      {/* <td className={styles.token1_break}>{member.email}</td> */}
                      <td className={styles.ellipsisa}><a href={member.website} target="_blank" rel="noreferrer">{member.website}</a></td>
                      <td className={styles.candidate1_email}></td>
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
  );
};

export default ThirdParty;
