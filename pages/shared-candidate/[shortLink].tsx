import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Container,
  Space,
  Card,
  Loader,
  Text,
  Center,
  TextInput,
  Button,
  Textarea,
  Paper,
  Anchor,
  Group,
  Select,
  Checkbox,
  Flex,
  Radio,
} from "@mantine/core";
import moment from "moment";
import { useToast } from "../../hooks/useToast";
import { useViewportSize } from "@mantine/hooks";
import { useUserState } from "../../hooks/useUserState";
import { useRouter } from "next/router";
import PrevResponse from "../../components/PrevResponse";
import {
  createComment,
  deleteInterviewSharingResume,
  getComments,
  getInterviewPartySharing,
  getInterviewSharingResults,
  getInterviewSharingResume,
  updateInterviewSharing,
} from "../../apis/mycvtracker";
import { AudioResponse } from "../../types/audioResponse_types";
import {
  Candidatedata,
  Comment,
  InterviewSharing,
  Resume,
  Status,
  StatusEnumKeys,
} from "../../types/question_types";
import RootComment from "../../components/RootComment";
import CommentForm, { OnSubmitParamsType } from "../../components/CommentForm";
import { useForm } from "@mantine/form";
import { alerts } from "../../utils/alert-utils";
import styles from "../../styles/questionAdd.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCandidateDetails } from "../../apis/mycvtracker/questions";
import MCQResponse from "../../components/MCQResponse";

const statusOptions = Object.keys(Status).map((key) => ({
  label: Status[key as `${StatusEnumKeys}`],
  value: key,
}));

let fullAudioRes: any[] = [];
const JobResumePreview = () => {
  const [resume, setResume] = useState<Resume>();
  const [interviewSharing, setInterviewSharing] = useState<InterviewSharing>();
  const [results, setResults] = useState<AudioResponse[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [candidate, setCandidate] = useState<Candidatedata>({interviewMode: "AUDIO"} as Candidatedata);
  const [loading, setLoading] = useState(true);

  const { showErrorToast, showSuccessToast } = useToast();
  const { token, user } = useUserState();
  const { query } = useRouter();
  const { height } = useViewportSize();
  const [reponseRes, setReponseRes] = useState(false);
  const [checkedRes, setCheckedRes] = useState(true);
  const [maskResume, setMaskResume] = useState('showResume');
  const [fullResponse, setFullResponse] = useState('showResponse');
  const [startDate, setStartDate] = useState(new Date());

  const newInterviewSharingForm = useForm({
    initialValues: useMemo(
      () => ({
        id: 0,
        content: "",
        thirdPartyId: 0,
        showResume: false,
        showOriginResume: false,
        showResponse: false,
        showFullResponse: false,
        enableComment: true,
        status: "",
        expiry: 0,
      }),
      []
    ),
    validate: {
      status: (value) => (value.length < 1 ? "Select status of sharing" : null),
    },
  });

  type NewInterviewSharingFormType = typeof newInterviewSharingForm.values;

  const { shortLink } = query;

  const isSharingOwner = user && interviewSharing?.fromUserId === user?.id;
  //console.log(isSharingOwner, 'user' + user, 'interviewid' + interviewSharing?.fromUserId, "userid" + user?.id)

  const fetchInterviewSharing = useCallback(async () => {
    try {
      const interviewSharingRes = await getInterviewPartySharing(
        shortLink as string
      );

      const newInterviewSharing: InterviewSharing = interviewSharingRes.data;
      setInterviewSharing(newInterviewSharing);
      const time = (moment(interviewSharingRes.data.expiry).format("DD/MM/yyyy hh:mm:ss"));
      setStartDate(interviewSharingRes.data.expiry);
      newInterviewSharingForm.setValues(newInterviewSharing);
      (newInterviewSharing.showResume) ? (setMaskResume('showResume')) : (newInterviewSharing.showOriginResume) ? (setMaskResume('showOriginResume')) : (setMaskResume('NoResume'));
      (newInterviewSharing.showResponse) ? (setFullResponse('showResponse')) : (newInterviewSharing.showFullResponse) ? (setFullResponse('showFullResponse')) : (setFullResponse('NoResponse'));

      const cbActions: Function[] = [];
      const requestPromises: Promise<any>[] = [];

      if (newInterviewSharing.showResume || newInterviewSharing.showOriginResume) {
        requestPromises.push(getInterviewSharingResume(shortLink as string));
        cbActions.push(setResume);
      }

      if (newInterviewSharing.showResponse || newInterviewSharing.showFullResponse) {
        requestPromises.push(getInterviewSharingResults(shortLink as string));

        cbActions.push(async (results : AudioResponse[]) => {
          if (!!results?.length) {
            const candResponse = await getCandidateDetails("", results[0].token)
            setCandidate(candResponse);
          }
          setResults(results);
        });
      }


      if (newInterviewSharing.enableComment && isSharingOwner) {
        console.log({ newInterviewSharing, isSharingOwner });

        requestPromises.push(getComments(newInterviewSharing.accessToken, token));
        cbActions.push(setComments);
      }

      const results = await Promise.allSettled(requestPromises);

      results.forEach((result, idx) => {
        if (result.status === "rejected") {
          showErrorToast(result.reason);
          return;
        }
        cbActions[idx](result?.value?.data || []);


      });
    } catch (error) {
      showErrorToast("Your sharing is not exists! Please check it again");
    }

    setLoading(false);
  }, [isSharingOwner, shortLink, showErrorToast, token]);

  useEffect(() => {
    if (shortLink) {
      fetchInterviewSharing();
    }
    setCheckedRes(true)
  }, [fetchInterviewSharing, shortLink, checkedRes]);

  const handleUpdateInterviewSharing = useCallback(
    async (values: NewInterviewSharingFormType) => {
      setCheckedRes(true);

      if (values.showFullResponse || values.showResponse || values.showOriginResume || values.showResume) {
        setReponseRes(false);
      } else {
        setReponseRes(true);
      }
      if (!interviewSharing) return;
      if (values.showFullResponse || values.showResponse || values.showOriginResume || values.showResume) {
        try {
          await updateInterviewSharing(values, interviewSharing.id, token);
          showSuccessToast("Your sharing has been updated");
          const results = await fetchInterviewSharing();
        } catch (e: any) {
          console.log(e);
          if (alerts[e.response.status])
            showErrorToast(alerts[e.response.status].message);
          else showErrorToast("Encountered Some Error");
        }
      }
    },
    [
      fetchInterviewSharing,
      interviewSharing,
      showErrorToast,
      showSuccessToast,
      token,
    ]
  );

  if (loading) {
    return (
      <Center w={100} h={100}>
        <Loader />
      </Center>
    );
  }

  const handleCommentFormSubmit = async (values: OnSubmitParamsType) => {
    await createComment({
      email: values.email,
      name: values.name,
      token: interviewSharing?.accessToken,
      review: values.content,
    });
    showSuccessToast("Successful create new comment!");
    if (isSharingOwner) {
      const comments = await getComments(
        interviewSharing?.accessToken || "",
        token
      );
      setComments(comments.data);
    }
  };

  const handleDeleteSharing = async () => {

    if (window.confirm("Are you sure you want get candidate results by email") === false) {
      return
    }

    if (!interviewSharing) return;
    const id = interviewSharing?.id

    await deleteInterviewSharingResume(id, token);
    showSuccessToast("Successful delete sharing!");
  };

  const setResponseValue = (value: any) => {
    setFullResponse(value);
    newInterviewSharingForm.setFieldValue(value, true);
    (value == 'showResponse') ? newInterviewSharingForm.values.showFullResponse = false : newInterviewSharingForm.values.showResponse = false;
    if (value !== "No Response") {
      setReponseRes(false);
      newInterviewSharingForm.values.showFullResponse = false;
      newInterviewSharingForm.values.showResponse = false;
    }
  }
  const setResumeValue = (value: any) => {
    setMaskResume(value);
    newInterviewSharingForm.setFieldValue(value, true);
    (value == 'showResume') ? newInterviewSharingForm.values.showOriginResume = false : newInterviewSharingForm.values.showResume = false;
    if (value !== "No Resume") {
      setReponseRes(false);
      newInterviewSharingForm.values.showOriginResume = false;
      newInterviewSharingForm.values.showResume = false;
    }
  }

  fullAudioRes = results;
  if (interviewSharing?.showFullResponse) {
    fullAudioRes = fullAudioRes.slice(1, -2)
  } else {
    (fullAudioRes.length > 7) ? fullAudioRes = fullAudioRes.slice(0, 5) : (fullAudioRes.length === 6) ? fullAudioRes = fullAudioRes.slice(0, 4) : fullAudioRes = fullAudioRes.slice(0, 3);
  }
  const handleDateChange = (e: any) => {
    setStartDate(e);
    const expiry_date = moment(e, 'DD/MMyyyy hh:mm:ss').valueOf();
    newInterviewSharingForm.values.expiry = expiry_date;
    //const deadLine_date = moment(e).format("yyyy-MM-DD hh:mm:ss");
  };
  return (
    <Container>
      <h1>Resume Preview</h1>

      <Space h="xl" />

      <Container>
        {interviewSharing?.showOriginResume && (
          <Card shadow="sm" radius="md" withBorder>
            <Text weight={500} mb="lg">
              Resume
            </Text>
            {interviewSharing?.accessToken ? (
              <div
                style={{
                  height: `${height > 800 ? height - 300 : height}px`,
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://mycvtracker.com/pdf-viewer.html?pdf=${process.env.NEXT_PUBLIC_MYCVTRACKER_API_HOST}/thirdparty-sharing/previewResume?accessToken=${interviewSharing.accessToken}`}
                ></iframe>
              </div>
            ) : (
              <Text mt="lg"> No resume link to sharing</Text>
            )}
          </Card>
        )}
        {interviewSharing?.showResume && (
          <Card shadow="sm" radius="md" withBorder>
            <Text weight={500} mb="lg">
              Resume
            </Text>
            {interviewSharing?.accessToken ? (
              <div
                style={{
                  height: `${height > 800 ? height - 300 : height}px`,
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://mycvtracker.com/pdf-viewer.html?pdf=${process.env.NEXT_PUBLIC_MYCVTRACKER_API_HOST}/thirdparty-sharing/previewResume?accessToken=${interviewSharing.accessToken}`}
                ></iframe>
              </div>
            ) : (
              <Text mt="lg"> No resume link to sharing</Text>
            )}
          </Card>
        )}
        {interviewSharing?.showResponse && (
          <>
            <Space h="xl" />
            <Card mt="xl" mb="xl" shadow="sm" radius="md" withBorder>
              <Text weight={500}>Results</Text>
              {!results.length && <Text> No Results</Text>}

              {results.length > 0 &&
                fullAudioRes.map((response) => (
                  ((response.questionId !== 21) &&  [ "MCQ", "MCQ_WITH_HR"].includes(candidate.interviewMode || "")) ? <MCQResponse  data={response} key={response.questionId} /> :
                  <PrevResponse data={response} key={response.questionId} />
                  // <PrevResponse data={response} key={response.questionId} />
                ))}
            </Card>
          </>
        )}
        {interviewSharing?.showFullResponse && (
          <>
            <Space h="xl" />
            <Card mt="xl" mb="xl" shadow="sm" radius="md" withBorder>
              <Text weight={500}>Results</Text>
              {!results.length && <Text> No Results</Text>}
              {results.length > 0 &&
                fullAudioRes.map((response) => (
                  ((response.questionId !== 21) && [ "MCQ", "MCQ_WITH_HR"].includes(candidate.interviewMode || "")) ? <MCQResponse  data={response} key={response.questionId} /> :
                  <PrevResponse data={response} key={response.questionId} />
                ))}
            </Card>
          </>
        )}

        {interviewSharing?.enableComment && (
          <>
            <Space h="sm" />
            <Card mt="xl" mb="xl" shadow="sm" radius="md" withBorder>
              <Text weight={500}>Comment</Text>

              <CommentForm
                onSubmit={handleCommentFormSubmit}
                initialValues={{
                  email: user?.email || interviewSharing.partyEmail,
                  name: user ? user.firstName + user.lastName : "",
                  content: "",
                }}
                readOnlyEmail
              />

              {isSharingOwner &&
                comments.map((comment) => (
                  <RootComment
                    key={comment.id}
                    comment={comment}
                    interviewSharing={interviewSharing}
                  />
                ))}
            </Card>
          </>
        )}

        {isSharingOwner && (
          <Card shadow="sm" radius="md" withBorder>
            <Text weight={500} mb="lg">
              Edit Sharing
            </Text>
            <Paper p="md" my="md">
              <form
                onSubmit={newInterviewSharingForm.onSubmit(
                  handleUpdateInterviewSharing
                )}
              >
                <>
                  <Select
                    mt={10}
                    data={statusOptions}
                    label="Sharing Status"
                    value={
                      newInterviewSharingForm.getInputProps("status").value
                    }
                    placeholder="Select Sharing Status"
                    withAsterisk
                    error={newInterviewSharingForm.errors?.status || ""}
                    onChange={(value) =>
                      newInterviewSharingForm.setFieldValue(
                        "status",
                        value || ""
                      )
                    }
                  />

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
                  {reponseRes && <div className={styles.reposnse_clr}>Select atleast one Resume/Response</div>}

                  <div className={styles.deadline__date}>Expiry Date</div>
                  <DatePicker
                    selected={startDate}
                    onChange={(e) => handleDateChange(e)}
                  />
                  {/* <Checkbox
                    mt={16}
                    label="Enable Comment"
                    checked={
                      newInterviewSharingForm.getInputProps("enableComment")
                        .value
                    }
                    {...newInterviewSharingForm.getInputProps("enableComment")}
                  /> */}

                  <Flex mt={32} justify="flex-end">
                    <Button
                      w={100}
                      type="submit"
                      variant="filled"
                      my="sm"
                    // disabled={isLoading}
                    // loading={isLoading}
                    >
                      Update
                    </Button>
                    {/* <Button
                      ml="sm"
                      type="button"
                      variant="filled"
                      my="sm"
                      color="red"
                      onClick={handleDeleteSharing}
                    >
                      Delete sharing
                    </Button> */}
                  </Flex>
                </>
              </form>
            </Paper>
          </Card>
        )}
      </Container>
    </Container>
  );
};

export default JobResumePreview;
