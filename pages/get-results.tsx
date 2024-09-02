import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  MutableRefObject,
  useMemo,
} from "react";

import {
  Container,
  Center,
  Button,
  TextInput,
  Title,
  Select,
  Modal,
  Radio,
  Autocomplete,
  Table,
  Space,
  Checkbox,
  Group,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  FaRegSave,
  FaSave,
  FaRegEdit,
  FaEdit,
  FaUserEdit,
} from "react-icons/fa";

import {
  createInterviewSharing,
  deleteCandidate,
  deleteInterviewSharingResume,
  getCandidateLsitCount,
  getInterviewSharings,
  linkResumeToCandidateApi,
  lookupResumes,
  saveAddNotes,
  sendGetCandidateResult,
  showEmployerResults,
  showThirdParties,
} from "../apis/mycvtracker";
import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";
import {
  CandidateResultRequest,
  InterviewMode,
} from "../types/assignInterview_types";
import { alerts } from "../utils/alert-utils";
import styles from "../styles/questionAdd.module.css";
import { getInterviewResults } from "../apis/mycvtracker";
import { useRouter } from "next/router";
import { AudioResponse } from "../types/audioResponse_types";
import { getInterviewResponses } from "../apis/mycvtracker";
import PrevResponse from "../components/PrevResponse";
import { Pagination } from "@mantine/core";
import {
  Candidatedata,
  CandidateResume,
  Empdata,
  InterviewSharing,
  Status,
  StatusEnumKeys,
} from "../types/question_types";
import { IconSearch } from "@tabler/icons-react";
import moment from "moment/moment";
// import { ClassNames } from "@emotion/react";
import { useDebounce } from "../hooks/useDebounce";
import { sendRemiderRequest } from "../apis/mycvtracker/assign-interview";
import {
  Badge,
  Textarea,
  MultiSelect,
  Paper,
  RangeSlider,
  Stack,
  Box,
  Text,
  Flex,
} from "@mantine/core";
import { sendAssignInterview } from "../apis/mycvtracker";
import { useForm } from "@mantine/form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MCQResponse from "../components/MCQResponse";
import { InterviewSkillCategory } from "../types/interview_skill_category_type";
import { getInterviewSkillCategories } from "../apis/mycvtracker/interview-skill-catogory";
import { toInterviewTopics } from "../utils/interview-skill-category-utils";

// import { symlink } from "fs";
// import { getIntResultByEmail } from "../apis/mycvtracker/assign-interview";

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
type objType = {
  value: string;
  name: number;
};
const objArray: Array<objType> = [];
//let createdDate = new Date();
let createdDate: Date = new Date();

const statusOptions = Object.keys(Status).map((key) => ({
  label: Status[key as `${StatusEnumKeys}`],
  value: key,
}));

const GetResults = () => {
  // const details = useForm({
  //   initialValues: {
  //     candidate: "",
  //     candidateEmail: "",
  //     candidateList: "",
  //     candidateName: "",
  //     interviewType: "",
  //     invite: "",
  //     jobLink: "",
  //     resultOwners: "",
  //     token: "",
  //   },
  //   validate: {
  //     candidate: (value) => (value.length < 5 ? "Invalid Candidate Email" : null),
  //     token: (value) => (value.length < 5 ? "Invalid Token" : null),
  //   },
  // });

  const { token } = useUserState();
  const router = useRouter();
  const pageCount = useRef(0);
  const { showErrorToast, showSuccessToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponses] = useState({
    loading: false,
    data: null as Candidatedata[] | null,
  });
  const [results, setResults] = useState<{
    data: AudioResponse[];
    loading: boolean;
  }>({ data: [], loading: false });
  const [emailResponce, setemailResponce] = useState({
    loading: false,
    resdata: [],
  });
  const [listCount, setListCount] = useState({ loading: false, data: [] });
  const [search, setSearch] = useState("");
  const [partyLength, setPartyLength] = useState(1);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const [delRes, setDelRes] = useState({ data: {} });
  const [pageDel, setPagedel] = useState();
  const [linkResumePage, setLinkResumePage] = useState(1);
  const [linkResumeModalOpened, setLinkResumeModalOpened] = useState(false);
  const [createInterviewModalOpened, setCreateInterviewModalOpened] =
    useState(false);
  const [shareInterviewModalOpened, setShareInterviewModalOpened] =
    useState(false);
  const [foundResumes, setFoundResumes] = useState<CandidateResume[]>([]);
  const [thirdParties, setThirdPaties] = useState<Empdata[]>([]);
  const [interviewSharings, setInterviewSharings] = useState<
    InterviewSharing[]
  >([]);
  const [loadingInterviewSharings, setLoadingInterviewSharings] =
    useState(false);
  const [loadingFoundResumes, setLoadingFoundResumes] = useState(false);
  const [selectedLinkResume, setSelectedLinkResume] =
    useState<CandidateResume | null>(null);
  const [detailLinkResume, setDetailLinkResume] = useState<
    CandidateResume | undefined
  >(undefined);
  const [addEmployer, setaddEmployer] = useState(false);
  const [showEmployer, setshowEmployer] = useState(false);
  const [empresponse, setEmpresponse] = useState({
    loading: false,
    data: null as Empdata[] | null,
  });
  const [dataMap, setDataMap] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [saveNotes, setSaveNotes] = useState(false);
  const [editNotes, setEditNotes] = useState(true);
  const [candName, setCandName] = useState("");
  const [audioRes, setAudioRes] = useState(false);
  const addNoteRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [notePage, setNotePage] = useState(1);
  const [maskResume, setMaskResume] = useState("showResume");
  const [fullResponse, setFullResponse] = useState("showResponse");
  const [reponseRes, setReponseRes] = useState(false);
  const [noCV, setNoCV] = useState(false);
  const [noRes, setNoRes] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notesContent, setNotesContent] = useState("");
  const [notesToken, setNotesToken] = useState();
  // const [updateNotes,setUpdateNotes] = useState<any | null>(null);
  const [updateNotes, setUpdateNotes] = useState("");

  const [interviewSkills, setinterviewSkills] = useState<
    InterviewSkillCategory[]
  >([]);

  const getInterviewSkills = useCallback(
    async (params: Record<string, string | number> = {}) => {
      const res = await getInterviewSkillCategories(params);
      setinterviewSkills(res);
    },
    []
  );

  useEffect(() => {
    getInterviewSkills();
  }, [getInterviewSkills]);

  const InterviewTopics = useMemo(
    () => toInterviewTopics(interviewSkills),
    [interviewSkills]
  );

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
    if (createInterviewModalOpened) {
      fetchThirdParties("", "RECRUITER_PARTY");
    }
    //setReponseRes(reponseRes)
  }, [createInterviewModalOpened, fetchThirdParties]);

  const details = useForm({
    initialValues: {
      candidateName: "",
      invite: "",
      resultOwners: "info@mycvtracker.com",
      candidateEmail: "",
      interviewType: [] as InterviewType[],
      noOfQuestions: "",
      jobLink: "https://mycvtracker.com/jobs-list",
      candidateList: "",
      deadline: "",
      employerId: 0,
      notes: "",
      type: "EMPLOYER",
      interviewMode: "AUDIO",
      timeBetweenQuestions: 60,
      // employerName: [] as employerName[],
    },
    validate: {
      candidateEmail: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid Candidate Email",
      resultOwners: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid Owner Email",
      candidateName: (value) =>
        value.length <= 1 ? "Candidate name cannot be empty" : null,
      jobLink: (value) => (value.length < 4 ? "Invalid Job Link" : null),
      interviewType: (value) =>
        value.length < 1 ? "Select atleast 1 topic" : null,
      timeBetweenQuestions: (value) =>
        value < 1 ? "Invalid time between questions" : null,
      // date: (value) => (value.length < 8 ? "Entervalid date" : null),
    },
  });

  type FormType = typeof details.values;

  const newInterviewSharing = useForm({
    initialValues: {
      content: "",
      thirdPartyId: 0,
      showResume: false,
      showOriginResume: false,
      showResponse: false,
      showFullResponse: false,
      enableComment: true,
      NoResume: false,
      NoResponse: false,
      status: "",
    },
    validate: {
      content: (value) =>
        value.length <= 1 ? "Candidate name cannot be empty" : null,
      status: (value) => (value.length < 1 ? "Select status of sharing" : null),
      thirdPartyId: (value) =>
        value <= 0 ? "Select third party want to share" : null,
    },
  });

  type NewInterviewSharingFormType = typeof newInterviewSharing.values;

  const handleCreateInterviewSharing = useCallback(
    async (values: NewInterviewSharingFormType) => {
      const candidate = selectedCandidate?.current;
      if (!values.showOriginResume && !values.NoResume && !values.showResume) {
        values.showResume = true;
      }
      if (
        !values.showFullResponse &&
        !values.NoResponse &&
        !values.showResponse
      ) {
        values.showResponse = true;
      }
      if (
        values.showFullResponse ||
        values.showResponse ||
        values.showOriginResume ||
        values.showResume
      ) {
        setReponseRes(false);
      } else {
        setReponseRes(true);
      }
      if (!candidate) return;
      if (
        values.showFullResponse ||
        values.showResponse ||
        values.showOriginResume ||
        values.showResume
      ) {
        try {
          await createInterviewSharing(values, candidate, token);
          showSuccessToast("Your Request has been submitted");
          const results = await getInterviewSharings(token, candidate);
          setInterviewSharings(results.data);

          toggleCreateShareInterviewModal();
        } catch (e: any) {
          console.log(e);
          if (alerts[e.response.status])
            showErrorToast(alerts[e.response.status].message);
          else showErrorToast("Encountered Some Error");
        }
      }
    },
    [token, showErrorToast, showSuccessToast, reponseRes]
  );

  const addEmpAssInterview = () => {
    setaddEmployer(true);
    setshowEmployer(false);
    fetchThirdParties("", "EMPLOYER");
    handleAutocomplete();
  };

  const handleChangeSelect = (value: string) => {
    newInterviewSharing.setFieldValue("thirdPartyId", +value);
  };
  const handleChangeEmp = (value: string) => {
    details.setFieldValue("employerId", +value);
  };

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
      console.log(values);
      try {
        setIsLoading(true);
        await sendAssignInterview(
          {
            ...values,
            // values.candidateList = "c",
            //values.employerName = dataMap,
            interviewType: values.interviewType
              .map((t) => `${t.value}${t.level[0]}${t.level[1]}`)
              .join("_"),
          },
          token
        );
        showSuccessToast("Your Request has been submitted");
        getAllResults();
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

  const handleAutocomplete = async () => {
    try {
      const empresponse = await showEmployerResults(
        token,
        1,
        10,
        "",
        "EMPLOYER"
      );
      setEmpresponse({ data: empresponse.data, loading: false });
      if (empresponse.data) {
        for (var i = 0; i < empresponse.data.length; i++) {
          objArray.push({
            value: empresponse.data[i].name,
            name: empresponse.data[i].id,
          });
        }
      }
    } catch (e) {}
  };
  const getResultByEmail = //useCallback(
    async (values: CandidateResultRequest) => {
      if (
        window.confirm(
          "Are you sure you want get candidate results by email"
        ) === true
      ) {
        try {
          setIsLoading(true);
          await sendGetCandidateResult(values, token);
          showSuccessToast("Your Request has been submitted");
        } catch (e: any) {
          console.log(e);
          if (alerts[e.response.status])
            showErrorToast(alerts[e.response.status].message);
          else showErrorToast("Encountered Some Error");
        } finally {
          setIsLoading(false);
        }
      }
    };
  //,[token, showErrorToast, showSuccessToast]
  //);

  const getAllResults = React.useCallback(async () => {
    setshowEmployer(true);
    setaddEmployer(false);
    try {
      const listCount = await getCandidateLsitCount(token, "", search);
      setListCount({ data: listCount.data.noRecords, loading: false });
      setPartyLength(Math.ceil(listCount.data.noRecords / 10));
    } catch (e) {}
    try {
      // setResponses((prev) => ({ ...prev, loading: true }));
      const response = await getInterviewResults(token, 1, 10, "", search);
      setResponses({ data: response.data, loading: false });
    } catch (e) {}
  }, [search, token]);

  const debounceGetAllResults = useDebounce(getAllResults, 500);

  const handleOnChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      debounceGetAllResults();
      try {
        const listCount = await getCandidateLsitCount(
          token,
          "EMPLOYER",
          search
        );
        setListCount({ data: listCount.data.noRecords, loading: false });
        setPartyLength(Math.ceil(listCount.data.noRecords / 10));
      } catch (e) {}
    },
    [debounceGetAllResults]
  );

  //get Candidate details onload page
  useEffect(() => {
    if (token) {
      getAllResults();
    }
  }, [getAllResults, token]);

  
  const getInterviewResponce = useCallback(
    async (token: any) => {
      try {
        setResults((prev) => ({ ...prev, loading: true }));
        const results = await getInterviewResponses(token);
        setResults({ data: results.data, loading: false });
        if (results.data.length == 0) {
          showErrorToast(
            "Candidate has not finished the interview assignment yet!"
          );
        } else {
          // if(audioRes){
          // window.open(`http://localhost:3000/interview-app/shared-candidate/getAudioResults?token=${token}&ProductManager01`,'_blank');
          // }
          scrollIntoView({ alignment: "center" });
        }
      } catch (e) {}
    },
    [scrollIntoView, showErrorToast]
  );

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
    let offset = 10; //Math.ceil(selected * this.props.perPage);
    setNotePage(selected);
    try {
      const response = await getInterviewResults(
        token,
        selected,
        offset,
        "",
        search
      );
      setResponses({ data: response.data, loading: false });
    } catch (e) {}
  };

  const gedBadgeProps = (status: StatusEnumKeys) => {
    if (status === "CANDIDATE_REVIEW") {
      return { color: "dark" };
    }
    if (status === "CANDIDATE_PASSED") {
      return { color: "green" };
    }

    if (status === "CANDIDATE_INTERVIEW_BOOKED") {
      return { color: "yellow" };
    }
  };

  const handleShareInterview = async () => {
    toggleShareInterviewModal();

    const candidate = selectedCandidate?.current;
    if (!candidate) {
      return;
    }
    try {
      setLoadingInterviewSharings(true);
      const results = await getInterviewSharings(token, candidate);
      setInterviewSharings(results.data);
      setLoadingInterviewSharings(false);
    } catch (e) {}
  };

  const handleDelete = async (candToken: string) => {
    if (window.confirm("Are you sure you want delete the record?") === true) {
      try {
        const delRes = await deleteCandidate(candToken, token);
        setDelRes({ data: delRes.status });
        handlePagination(pageDel);
        if (delRes.status == 200)
          showSuccessToast("Record deleted successfully");
      } catch (e) {}
    }
  };

  const handleSendReminder = async (canToken: string) => {
    const candToken = {
      token: canToken,
    };
    if (
      window.confirm(
        "Are you sure you want send remainder email to Candidate?"
      ) === true
    ) {
      try {
        await sendRemiderRequest(candToken, token);
        showSuccessToast("Your Request has been submitted");
      } catch (e) {
        showErrorToast("Encountered Some Error");
      }
    }
  };

  const selectedCandidate = useRef<Candidatedata>(null);
  const getAllResultsONSelection = (e: any, candidate: Candidatedata) => {
    const {
      token: canToken,
      candidate: candidateEmail,
      resumeId,
      resume,
    } = candidate;

    if (e === "Get Response") {
      // @ts-ignore
      selectedCandidate.current = candidate;
      setCandName(candidate.candidateName);
      getInterviewResponce(canToken);
    } else if (e === "Share Audio Results") {
      setAudioRes(true);
      //getInterviewResponce(canToken);
      window.open(
        `/interview-app/shared-candidate/getAudioResults?token=${canToken}&type=audio`,
        "_blank"
      );
    } else if (e === "Share Short Audio Results") {
      window.open(
        `/interview-app/shared-candidate/getAudioResults?token=${canToken}&type=shortAudio`,
        "_blank"
      );
    } else if (e === "Get Result By Email") {
      getResultByEmail({ token: canToken });
    } else if (e === "Send Reminder Interview") {
      handleSendReminder(canToken);
    } else if (e === "Share Interview") {
      // @ts-ignore
      selectedCandidate.current = candidate;
      handleShareInterview();
    } else if (e === "Delete") {
      handleDelete(canToken);
    } else if (e === "LinkedResumeDetail") {
      // @ts-ignore
      selectedCandidate.current = candidate;
      if (!resumeId) {
        onLookupResume({});
      } else {
        setDetailLinkResume(resume);
      }
    }
  };

  const toggleLinkResumeModal = () => {
    setFoundResumes([]);
    setLinkResumePage(1);
    setLinkResumeModalOpened((prevState) => !prevState);
  };
  const shortLinkClick = (item: InterviewSharing) => {
    window.open(`/interview-app/shared-candidate/${item.shortLink}`, "_blank");
  };
  const toggleShareInterviewModal = () => {
    setInterviewSharings([]);

    setShareInterviewModalOpened((prevState) => !prevState);
  };

  const toggleCreateShareInterviewModal = () => {
    setReponseRes(false);
    selectedCandidate?.current?.resumeId
      ? setMaskResume("showResume")
      : setMaskResume("NoResume");
    selectedCandidate?.current?.completed
      ? setFullResponse("showResponse")
      : setFullResponse("NoResponse");
    setNoRes(false);
    setNoCV(false);
    newInterviewSharing.reset();
    setCreateInterviewModalOpened((prevState) => !prevState);
  };

  const lookUpResume = async ({
    email = "",
    pageNo = 1,
    numOfRecords = 20,
  }: {
    email?: string;
    pageNo?: number;
    numOfRecords?: number;
  }) => {
    try {
      setLoadingFoundResumes(true);
      const resumeResponse = await lookupResumes(
        { email, pageNo, numOfRecords },
        token
      );
      setFoundResumes(resumeResponse.data);

      setLoadingFoundResumes(false);
    } catch (e) {
      showErrorToast("Loading resumes failed");
    }
  };

  const onLookupResume = async ({
    email = "",
    pageNo = 1,
    numOfRecords = 20,
  }: {
    email?: string;
    pageNo?: number;
    numOfRecords?: number;
  }) => {
    toggleLinkResumeModal();
    lookUpResume({ email, pageNo, numOfRecords });
  };

  const handleLoadMore = async () => {
    try {
      setLoadingFoundResumes(true);
      const resumeResponse = await lookupResumes(
        { pageNo: linkResumePage + 1 },
        token
      );
      setLinkResumePage((prev) => prev + 1);
      setFoundResumes((prevResumes) => [
        ...prevResumes,
        ...resumeResponse.data,
      ]);

      setLoadingFoundResumes(false);
    } catch (e) {
      showErrorToast("Loading resumes failed");
    }
  };

  const linkResumeToCandidate = async () => {
    const interviewToken = selectedCandidate.current?.token;
    if (interviewToken && selectedLinkResume) {
      try {
        await linkResumeToCandidateApi(
          token,
          interviewToken,
          selectedLinkResume.id
        );
        toggleLinkResumeModal();

        await getAllResults();
      } catch (e) {
        showErrorToast("Linking resume has failed!");
      }
    }
  };

  const linkResumeDetailOpened = !!detailLinkResume;
  const skipAssignEmp = () => {
    getAllResults();
  };

  const autoSelectionValue = (e: any) => {
    // setDataMap()
    details.values.employerId = e;
    setDataMap(dataMap);
  };

  const twoDaysRemaining = (value: any) => {
    const reservedDate = new Date(value).getTime();
    const today = new Date().getTime();
    const days = Math.ceil((today - reservedDate) / (1000 * 3600 * 24));
    const sendReminder = "Send Reminder Interview";
    if (days > 2) {
      //setReminderDate(sendReminder);
      return true;
    } else {
      // setReminderDate('');
      return false;
    }
  };
  const handleDateChange = (e: any) => {
    setStartDate(e);
    const deadLine_date = moment(e).format("yyyy-MM-DD hh:mm:ss");
    details.values.deadline = deadLine_date;
  };
  const getNotesContent = async (e: any) => {
    setNotesContent(e.target.value);
    console.log(e.target.value);
  };
  const addNotes = async (noteToken: any, notes: any) => {
    const notesData = { notes: notes };
    try {
      await saveAddNotes(notesData, noteToken, token);
      showSuccessToast("Notes added successfully");
      toggleAddNotesModal("");
    } catch (e: any) {
      console.log(e);
      if (alerts[e.response.status])
        showErrorToast(alerts[e.response.status].message);
      else showErrorToast("Encountered Some Error");
    }
    try {
      const response = await getInterviewResults(
        token,
        notePage,
        10,
        "",
        search
      );
      setResponses({ data: response.data, loading: false });
    } catch (e) {}
    // if (member.id == "1092") {
    //   setSaveNotes(false);
    //   setEditNotes(true);
    // }
  };

  const saveEditNotes = () => {
    setNotes("test test");
    addNoteRef.current.style.display = "none";
    setSaveNotes(true);
    setEditNotes(false);
  };

  const setResponseValue = (value: any) => {
    setFullResponse(value);
    selectedCandidate?.current?.completed
      ? (newInterviewSharing.setFieldValue(value, true), setNoRes(false))
      : (setFullResponse("NoResponse"),
        newInterviewSharing.setFieldValue("NoResponse", true),
        setNoRes(true));

    //newInterviewSharing.setFieldValue(value, true);
    value == "showResponse"
      ? (newInterviewSharing.values.showFullResponse = false)
      : (newInterviewSharing.values.showResponse = false);

    if (value !== "No Response") setReponseRes(false);
  };
  const setResumeValue = (value: any) => {
    setMaskResume(value);
    selectedCandidate?.current?.resumeId
      ? (newInterviewSharing.setFieldValue(value, true), setNoCV(false))
      : (setMaskResume("NoResume"),
        newInterviewSharing.setFieldValue("NoResume", true),
        setNoCV(true));

    value == "showResume"
      ? (newInterviewSharing.values.showOriginResume = false)
      : (newInterviewSharing.values.showResume = false);

    if (value !== "No Resume") setReponseRes(false);
  };
  const handlePartyDelete = async (partyid: number) => {
    if (window.confirm("Are you sure you want to delete sharing") === false) {
      return;
    }
    await deleteInterviewSharingResume(partyid, token);
    showSuccessToast("Successfully deleted sharing!");

    const candidate = selectedCandidate?.current;
    if (!candidate) {
      return;
    }
    try {
      setLoadingInterviewSharings(true);
      const results = await getInterviewSharings(token, candidate);
      setInterviewSharings(results.data);
      setLoadingInterviewSharings(false);
    } catch (e) {}
  };

  const toggleAddNotesModal = (member: any) => {
    setNotesToken(member?.token);
    //const note_add: any = member.notes;
    member?.notes ? setUpdateNotes(member?.notes) : setUpdateNotes("");
    setShowSuccess((prevState) => !prevState);
  };

  //copy code

  const [tooltipText, setTooltipText] = useState("");
  const [copyEmail, setEmail] = useState("");
  const handleMouseEnter = (email: string) => {
    setEmail(email);
    setTooltipText(`Copy: ${email}`);
  };
  const handleMouseLeave = () => {
    setTooltipText("");
  };
  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email); // Use the Clipboard API to copy text
    setTooltipText("Copied!"); // Update the tooltip text
  };

  return (
    <Container sx={{ padding: "0", maxWidth: "1200px" }}>
      <Title sx={{ marginLeft: "10px" }}>Add/Get Interviews</Title>
      <Button
        sx={{ marginLeft: "10px" }}
        type="submit"
        variant="filled"
        my="sm"
        disabled={isLoading}
        loading={isLoading}
        onClick={addEmpAssInterview}
      >
        Assign Interview
      </Button>
   
      {showEmployer && (
        <div>
          <TextInput
            sx={{ marginLeft: "10px" }}
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
                  <th className={styles.hideCol__xs}>Mobile</th>
                  <th className={styles.hideCol__xs}>Location</th>
                  <th>Skills</th>
                  <th className={styles.hideCol__xs}>Assigned On</th>
                  <th className={styles.hideCol__xss}>Interviewed On</th>
                  <th className={styles.hideCol__xss}>RefCode</th>
                  <th className={styles.hideCol__xss}>Score</th>
                  <th className={styles.hideCol__xss}>Keywords</th>

                  <th>Linked CV</th>
                  {/* <th>Token</th> */}
                  {/* <th className={styles.hideCol__xs}>Job Link</th> */}
                  {/* <th>Get Result By Email</th>
              <th>Get Responce</th>
              <th>Delete</th> */}
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {response.data !== null &&
                  response.data.length > 0 &&
                  response.data.map((member) => (
                    // response.data.map((member) => (
                    <tr id={`${member.id}`} key={member.id}>
                      <td className={styles.token_break1}>
                        {member.candidateName}
                      </td>
                      <td
                        className={styles.candidate_email}
                        onMouseEnter={() => handleMouseEnter(member.candidate)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => copyEmailToClipboard(member.candidate)}
                      >
                        {member.candidate}
                        {tooltipText && copyEmail === member.candidate && (
                          <div className={styles.tooltip}>
                            <span className={styles.tooltiptext}>
                              {tooltipText}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className={styles.candidate_email}>
                        {member.mobile}
                      </td>
                      <td className={styles.candidate_email}>
                        {member.location}
                      </td>
                      <td className={styles.token_break}>
                        {member.interviewType}
                      </td>

                      {/* member.createdAt ? setRedDate(true): setRedDate(false) */}
                      {member.completedAt ? (
                        <td className={styles.hideCol__xs}>
                          {member.createdAt
                            ? moment(member.createdAt).format(
                                "DD/MM/YYYY hh:mm"
                              )
                            : ""}
                        </td>
                      ) : twoDaysRemaining(member.createdAt) ? (
                        <td
                          className={styles.hideCol__xs}
                          style={{ color: "red" }}
                        >
                          {member.createdAt
                            ? moment(member.createdAt).format(
                                "DD/MM/YYYY hh:mm"
                              )
                            : ""}{" "}
                        </td>
                      ) : (
                        <td
                          className={styles.hideCol__xs}
                          style={{ color: "black" }}
                        >
                          {member.createdAt
                            ? moment(member.createdAt).format(
                                "DD/MM/YYYY hh:mm"
                              )
                            : ""}
                        </td>
                      )}
                      {/* <td className={styles.hideCol__xs}>{ member.createdAt ? moment(member.createdAt).format("DD/MM/YYYY hh:mm") : ''}
                        </td> */}

                      <td className={styles.hideCol__xs}>
                        {member.completedAt
                          ? moment(member.completedAt).format(
                              "DD/MM/YYYY hh:mm"
                            )
                          : ""}
                      </td>

                      {/* Ref Code */}
                      <td className={styles.token_break}>{member.refCode}</td>

                      {/* Score */}
                      <td className={styles.token_break}>{member.score}</td>
                      {/* Matching Keywords */}
                      <td className={styles.token_break}>
                        {member.matchingKeywords}
                      </td>

                      {/* Resume */}
                      <td className={styles.token_break}>
                        {member.resumeId ? (
                          <> {member.resume?.resumeTitle}</>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* <td>{(member.completedAt)}</td>  */}
                      {/* <td >{member.token}</td> */}
                      {/* <td className={styles.ellipsis}>
                        <a
                          href={member.jobLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {member.jobLink}
                        </a>
                      </td> */}
                      {/* <td><Button type='button' className={styles.create_uuid} onClick={() => getResultByEmail({ "token": member.token })}>Get Result By Email</Button></td>
                    <td><Button type='button' className={styles.create_uuid} onClick={() => getInterviewResponce(member.token)}>Get Responce</Button></td>
                    <td><button type='button' className={styles.delete_btn} onClick={() => { handleDelete(member.token); }}>
                      <svg className={styles.svg_icon} viewBox="0 0 20 20" >
                        <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306" fill="#FFFFFF" />
                      </svg>
                    </button></td> */}
                      {member.notes ? (
                        <td id={"note" + member.id}>
                          {member.notes}{" "}
                          <span onClick={() => toggleAddNotesModal(member)}>
                            {<FaRegEdit />}
                          </span>
                        </td>
                      ) : (
                        <td id={"editnote" + member.id}>
                          Add Notes
                          <span onClick={() => toggleAddNotesModal(member)}>
                            {<FaRegEdit />}
                          </span>
                        </td>
                      )}
                      <td>
                        <Select
                          sx={{ width: "120px" }}
                          placeholder="Select Action"
                          data={[
                            {
                              value: "Get Result By Email",
                              label: "Get Result By Email",
                            },
                            { value: "Get Response", label: "Get Response" },
                            {
                              value: !member?.completed
                                ? "Send Reminder Interview"
                                : "",
                              label: !member?.completed
                                ? "Send Reminder Interview"
                                : "",
                            },

                            {
                              value:
                                member?.resumeId || member?.completed
                                  ? "Share Interview"
                                  : "",
                              label:
                                member?.resumeId || member?.completed
                                  ? "Share Interview"
                                  : "",
                            },
                            { value: "Delete", label: "Delete" },
                            {
                              value: "LinkedResumeDetail",
                              label: !member.resumeId
                                ? "Link CV"
                                : "Resume Detail",
                            },
                            {
                              value: "Share Audio Results",
                              label: "Share Audio Results",
                            },
                            {
                              value: "Share Short Audio Results",
                              label: "Share Short Audio Results",
                            },
                          ]}
                          onChange={(e) => getAllResultsONSelection(e, member)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {response.data !== null && response.data.length > 0 && (
            <div ref={targetRef} className={styles.page}>
              <Pagination
                total={partyLength}
                position="center"
                onChange={handlePagination}
              />
            </div>
          )}
          <Modal
            opened={showSuccess}
            onClose={() => toggleAddNotesModal("")}
            title=""
          >
            <Textarea
              label="Add Notes"
              placeholder="Notes"
              autosize
              minRows={2}
              maxRows={4}
              defaultValue={updateNotes}
              onChange={(e) => getNotesContent(e)}
            />
            <Button
              className={styles.save_notestext}
              w={100}
              type="submit"
              variant="filled"
              my="sm"
              disabled={isLoading}
              loading={isLoading}
              onClick={() => addNotes(notesToken, notesContent)}
            >
              Save
            </Button>
          </Modal>
          <div className={styles.respmtop}>
            <span className={styles.cand_name}>
              {results.data.length > 0 && candName}
            </span>
            {results.loading && <p>Loading</p>}
            {/* {!results.loading && results.data.length === 0 && <Alert mt="md">Wrong token or no response</Alert>} */}
            {!results.loading &&
              results.data.length > 0 &&
              results.data.map((response) =>
                ["MCQ", "MCQ_WITH_HR"].includes(
                  selectedCandidate.current?.interviewMode || ""
                ) ? (
                  <MCQResponse data={response} key={response.questionId} />
                ) : (
                  <PrevResponse data={response} key={response.questionId} />
                )
              )}
          </div>

          <Modal
            opened={linkResumeModalOpened}
            size="lg"
            onClose={toggleLinkResumeModal}
            title="Select a resume to link"
          >
            <div>
              <Space h="xl" />
              {loadingFoundResumes && !foundResumes.length && "..."}
              {!!foundResumes.length &&
                foundResumes.map((aResume) => {
                  return (
                    <div
                      key={aResume.id}
                      className={`${styles.linkingModalResult__selectRow} ${
                        aResume.id === selectedLinkResume?.id &&
                        styles.linkingModalResult__selectedRow
                      }`}
                      onClick={() => setSelectedLinkResume(aResume)}
                    >
                      <div>
                        <a
                          rel="noreferrer"
                          target="_blank"
                          href={`https://mycvtracker.com/resumes/${aResume.originalLinkId}`}
                        >
                          {aResume.resumeTitle}
                        </a>
                      </div>

                      <div>
                        Uploaded at{" "}
                        {aResume.uploadedAt
                          ? moment(aResume.uploadedAt).format("DD/MM/YYYY")
                          : ""}
                      </div>
                    </div>
                  );
                })}
              {!loadingFoundResumes && foundResumes.length === 0 && (
                <div>No Resumes Found</div>
              )}
            </div>
            <div className={styles.linkingModalResult__buttonRow}>
              <Button onClick={() => linkResumeToCandidate()}>Submit</Button>{" "}
              <Button
                type="button"
                color="yellow"
                onClick={() =>
                  lookUpResume({ email: selectedCandidate?.current?.candidate })
                }
              >
                Lookup By Candidate Email
              </Button>
              <Button ml="xs" color="green" onClick={() => handleLoadMore()}>
                Load more
              </Button>
            </div>
          </Modal>

          <Modal
            size="xl"
            opened={shareInterviewModalOpened}
            onClose={toggleShareInterviewModal}
            title="Sharing interviews"
          >
            <div>
              <Button
                type="submit"
                variant="filled"
                my="sm"
                onClick={toggleCreateShareInterviewModal}
              >
                Add new party sharing
              </Button>
              <Space h="xl" />
              {loadingInterviewSharings && "..."}
              {!loadingInterviewSharings && (
                <Table striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Party</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Preview Link</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!interviewSharings.length && (
                      <tr>
                        <td colSpan={5}>No party sharing found</td>
                      </tr>
                    )}
                    {interviewSharings.map((item, idx) => {
                      return (
                        <tr key={item.id}>
                          <th scope="row">{idx + 1}</th>
                          <td>{item.partyName}</td>
                          <td>
                            <Badge {...gedBadgeProps(item.status)}>
                              {Status[item.status]}
                            </Badge>
                          </td>
                          <td>
                            {!!item.createdAt
                              ? moment(item.createdAt).format(
                                  "yyyy-MM-DD hh:mm"
                                )
                              : "-"}
                          </td>
                          <td>
                            {" "}
                            <a
                              className={styles.preview_link}
                              onClick={() => shortLinkClick(item)}
                            >
                              {item.shortLink}
                            </a>
                            {/* <a
                              rel="noreferrer"
                              target="_blank"
                              href={`/interview-app/shared-candidate/${item.shortLink}`}
                            >
                              {item.shortLink}
                            </a> */}
                          </td>
                          <td>
                            <button
                              type="button"
                              className={styles.delete_btn}
                              onClick={() => {
                                handlePartyDelete(item.id);
                              }}
                            >
                              <svg
                                className={styles.svg_icon}
                                viewBox="0 0 20 20"
                              >
                                <path
                                  d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"
                                  fill="#FFFFFF"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </div>
          </Modal>

          <Modal
            opened={createInterviewModalOpened}
            onClose={toggleCreateShareInterviewModal}
            title="Create share interview"
          >
            <div>
              <Paper p="md" my="md">
                <form
                  onSubmit={newInterviewSharing.onSubmit(
                    handleCreateInterviewSharing
                  )}
                >
                  <>
                    <Textarea
                      placeholder="Content"
                      label="Content"
                      withAsterisk
                      autosize
                      minRows={4}
                      maxRows={8}
                      {...newInterviewSharing.getInputProps("content")}
                    />

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
                      error={newInterviewSharing.errors?.thirdPartyId || ""}
                      onChange={handleChangeSelect}
                      onSearchChange={(search) => {
                        debounceFetchThirdParties(search, "RECRUITER_PARTY");
                      }}
                    />

                    <Select
                      mt={10}
                      data={statusOptions}
                      label="Sharing Status"
                      placeholder="Select Sharing Status"
                      withAsterisk
                      error={newInterviewSharing.errors?.status || ""}
                      onChange={(value) =>
                        newInterviewSharing.setFieldValue("status", value || "")
                      }
                    />
                    {noCV && (
                      <div className={styles.reposnse_clr}>There is no CV </div>
                    )}
                    <Radio.Group
                      value={maskResume}
                      onChange={setResumeValue}
                      label="Select CV"
                      withAsterisk
                    >
                      <Radio value="showResume" label="Masked CV" />
                      <Radio value="showOriginResume" label="Original CV" />
                      <Radio value="NoResume" label="No CV " />
                    </Radio.Group>
                    {noRes && (
                      <div className={styles.reposnse_clr}>
                        There is no Audio results{" "}
                      </div>
                    )}
                    <Radio.Group
                      value={fullResponse}
                      onChange={setResponseValue}
                      label="Select Response"
                      withAsterisk
                    >
                      <Radio value="showResponse" label="Partial Response" />
                      <Radio value="showFullResponse" label="Full Response" />
                      <Radio value="NoResponse" label="No Response" />
                    </Radio.Group>

                    {reponseRes && (
                      <div className={styles.reposnse_clr}>
                        Select atleast one Resume/Response
                      </div>
                    )}
                    {/* <Checkbox
                      mt={16}
                      label="Enable Comment"
                      {...newInterviewSharing.getInputProps("enableComment")}
                    /> */}

                    <Flex mt={32} justify="flex-end">
                      <Button
                        w={100}
                        type="submit"
                        variant="filled"
                        my="sm"
                        disabled={isLoading}
                        loading={isLoading}
                      >
                        Create
                      </Button>
                      <Button
                        w={100}
                        type="button"
                        variant="filled"
                        my="sm"
                        color="red"
                        className={styles.skip_emp}
                        onClick={toggleCreateShareInterviewModal}
                      >
                        Cancel
                      </Button>
                    </Flex>

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
            </div>
          </Modal>

          <Modal
            opened={linkResumeDetailOpened}
            title="Resume Detail"
            onClose={() => setDetailLinkResume(undefined)}
          >
            <div>
              <div className={styles.linkingResumeDetail__titleRow}>
                <div>{detailLinkResume?.resumeTitle}</div>
                <div className={styles.linkingResumeDetail__dateColor}>
                  Upload at{" "}
                  {detailLinkResume?.uploadedAt
                    ? moment(detailLinkResume?.uploadedAt).format("DD/MM/YYYY")
                    : ""}
                </div>
              </div>

              <div>
                <div>Masked Preview</div>
                <div>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={`https://mycvtracker.com/resumes/${detailLinkResume?.maskedLinkId}`}
                  >
                    {detailLinkResume?.maskedLinkId}
                  </a>
                </div>
              </div>
              <div>
                <div>Original Preview</div>
                <div>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={`https://mycvtracker.com/resumes/${detailLinkResume?.originalLinkId}`}
                  >
                    {detailLinkResume?.originalLinkId}
                  </a>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {addEmployer && (
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
                {...details.getInputProps("resultOwners")}
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
                        {InterviewTopics.find((t) => t.value === type.value)
                          ?.label || type.value}
                      </Text>
                      <RangeSlider
                        value={details.values.interviewType[index].level}
                        step={1}
                        minRange={1}
                        size="lg"
                        style={{ width: "100%" }}
                        max={5}
                        onChange={(e) =>
                          details.setFieldValue(
                            `interviewType.${index}.level`,
                            e
                          )
                        }
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
                placeholder="Job Link"
                label="Job Link"
                withAsterisk
                {...details.getInputProps("jobLink")}
              />
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
                filter={() => true}
                error={details.errors?.employerId || ""}
                onChange={handleChangeEmp}
                onSearchChange={(search) => {
                  debounceFetchThirdParties(search, "EMPLOYER");
                }}
              />
              <div className={styles.deadline__date}>Deadline</div>
              <DatePicker
                selected={startDate}
                onChange={(e) => handleDateChange(e)}
              />
              <div></div>

              <Button
                type="submit"
                variant="filled"
                my="sm"
                disabled={isLoading}
                loading={isLoading}
              >
                Assign
              </Button>
              <Button
                type="submit"
                variant="filled"
                my="sm"
                className={styles.skip_emp}
                onClick={skipAssignEmp}
              >
                Cancel
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
      )}
    </Container>
  );
};

export default GetResults;
