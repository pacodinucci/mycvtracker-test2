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
import PrevResponse from "../../components/PrevResponse";
import {

  getInterviewResponses,

} from "../../apis/mycvtracker";
import { AudioResponse } from "../../types/audioResponse_types";
import { Resume } from "../../types/question_types";
import styles from "../../styles/questionAdd.module.css";


const token1 = '';
const par = '';
const GetAudioResults = () => {

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
          results.data = results.data.slice(0, -2);
        } else {
          (results.data.length > 7) ? results.data = results.data.slice(0, 5) : (results.data.length === 6) ? results.data = results.data.slice(0, 4) : results.data = results.data.slice(0, 3)
        }
        setResults(results.data);
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
      {results.length > 0 && <h1>Audio results</h1>}
      <Container>
        {results.length > 0 ?
          <Card mt="xl" mb="xl" shadow="sm" radius="md" withBorder>
            {results.length > 0 &&
              results.map((response) => (
                (response.questionId !== 21) && <PrevResponse data={response} key={response.questionId} />
              ))}
          </Card> :
          <div className={styles.int_text}>Candidate has not finished the interview assignment yet!</div>
        }
      </Container>
    </Container>
  );
};

export default GetAudioResults;


