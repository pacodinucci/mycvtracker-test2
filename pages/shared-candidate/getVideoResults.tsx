import Link from "next/link";
import React, { useEffect, useState } from "react";

import {
  Container,
  Space,
  Card,
  Loader,
  Text,
  Center
} from "@mantine/core";

import { useToast } from "../../hooks/useToast";
import { useViewportSize } from "@mantine/hooks";
import { useUserState } from "../../hooks/useUserState";
import { useRouter } from "next/router";
import VideoPrevResponse from "../../components/VideoPrevResponse";
// import VideoPrevResponse from "../../components/VideoPrevResponse";
import {

  getInterviewResponses,

} from "../../apis/mycvtracker";
import { AudioResponse } from "../../types/audioResponse_types";
import { Resume } from "../../types/question_types";
import styles from "../../styles/questionAdd.module.css";






// http://localhost:3000/interview-app/VideoInterview?token=42e0211beb7042f1a9cb9b219501d809&interviewType=reactjs01

// http://localhost:3000/interview-app/shared-candidate/getVideoResults?token=42e0211beb7042f1a9cb9b219501d809&interviewType=reactjs01


// http://localhost:3000/interview-app/shared-candidate/getVideoResults?token=fb66821a4f814557949a8529125b3752&interviewType=reactjs01

// http://localhost:3000/interview-app/VideoInterview?token=fb66821a4f814557949a8529125b3752&interviewType=reactjs01


const token1 = '';
const par = '';
const GetVideoResults = () => {

  const [loading, setLoading] = useState(true);

  const { showErrorToast } = useToast();
  const { token } = useUserState();

  const router = useRouter();
  const [results, setResults] = useState<AudioResponse[]>([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const fetchAudioResults = async (candToken: any) => {
      try {
        setResults((prev) => ({ ...prev, loading: true }));
        const results = await getInterviewResponses(candToken);
        setLoading(false);
        if (queryParams.get("type") == 'audio') {
          results.data = [];
        } else {
          results.data
        }
        setResults(results.data);
        console.log(results.data)
      } catch (e) { }
    }

    if (true) {
      // router.replace(`/shared-candidate/getAudioResults?token=${queryParams.get("token")}`); 
      fetchAudioResults(queryParams.get("token"));
    }

  }, []);

  if (loading) {
    return (<div className={styles.audio_loader}>Loading.....<Center w={100} h={100} ><Loader /></Center></div>)
  }

  return (
    <Container>
      {results.length > 0 && <h1>Results</h1>}
      <Container>
        {results.length > 0 ?
          <Card mt="xl" mb="xl" shadow="sm" radius="md" withBorder>
            {results.length > 0 &&
              results.map((response) => (
                response.answerLocation === "/no-answer" ? (
                  <div key={response.questionId}>
                    <h4>{response.question}</h4>
                  <strong>No answer given</strong>
                    </div>
                ): (

                  (response.questionId !== 21) && <VideoPrevResponse data={response} key={response.questionId} />
                )
              ))}
          </Card> :
          <div className={styles.int_text}>Candidate has not finished the interview assignment yet!</div>
        }
      </Container>
    </Container>
  );
};

export default GetVideoResults;


