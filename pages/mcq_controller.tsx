import {
  Alert,
  Button,
  Flex,
  Loader,
  RingProgress,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import { FaCircle } from "react-icons/fa";
// import PrevResponse from "./PrevResponse";
import styles from "../styles/questionAdd.module.css";
import alanBtn from "@alan-ai/alan-sdk-web";
import { useEffect } from "react";
import audio from "../assets/homepage/audio.svg";
import PrevResponse from "../components/PrevResponse";

// import { useSpeechSynthesis } from "react-speech-kit";

type Props = {
  timeLeft: number;
  operation:
    | "startInterview"
    | "loading"
    | "recording"
    | "countdown"
    | "stopped";
  timeBetweenQuestions: number;
  totalQuestions: number;
  currectQuestion: number;
  isUploading: boolean;
  isChoosen: boolean;
  startInterview: () => void;
  skipQuestion: () => void;
  uploadAnswer: () => void;
  play: "play_rec" | "stop_recording" | "uploading";
};

const Mcq_controller = ({
  timeLeft,
  operation,
  startInterview,
  uploadAnswer,
  isChoosen,
  isUploading,
  play,
  currectQuestion,
  totalQuestions,
  timeBetweenQuestions
}: Props) => {
  // const { speak } = useSpeechSynthesis();
  const media = useMediaQuery("(max-width: 767px)");

  if (operation === "startInterview") {
    return (
      <>
        <div className={styles.rfire_fsize}>
          This is multiple choice quetions assesment
        </div>
        <Flex align="center" justify="center" style={{ height: 362 }}>
          <div>
            <button
              data-qa="video-button"
              className={styles.start_int_svg}
              onClick={startInterview}
            >
              {/* <svg fill="none" height="24" width="27" xmlns="http://www.w3.org/2000/svg">
                            <rect height="16" rx="3" width="18" y="4"></rect>
                            <path clip-rule="evenodd" d="M20 10.425a1 1 0 01.563-.899l5-2.432a1 1 0 011.437.9v8.012a1 1 0 01-1.413.91l-5-2.264a1 1 0 01-.587-.91v-3.317z"></path>
                        </svg> */}
              {/* <img src={audio} alt="step 1" /> */}
              Start Interview
            </button>
          </div>
        </Flex>
      </>
    );
  }

  if (operation === "loading") {
    return (
      <Flex align="center" justify="space-between" style={{ height: 85 }}>
        <Title order={3}>Loading Questions..</Title>
        <Loader size={70} />
      </Flex>
    );
  }

  if (operation === "countdown") {
    return (
      <Flex  align="center" >
        {/* Make it invisible to help button center */}
         <div style={{marginRight: "auto", visibility: "hidden"}}>
         <RingProgress
              style={{ marginLeft: 28 }}
              size={media ? 80 : 100}
              sections={[
                {
                  value: (timeLeft / timeBetweenQuestions) * 100,
                  color: timeLeft < 10 ? "red" : "blue",
                },
              ]}
              label={
                <Text align="center" size={media ? "sm" : "md"}>
                  {timeLeft} sec
                </Text>
              }
            />
         </div>


            <Button
              onClick={uploadAnswer}
              disabled={isUploading || !isChoosen}

            >
              {isUploading && <Loader size="sm" color="blue"/> }
              {currectQuestion == totalQuestions - 1
                ? "Finish Interview"
                : "Next Question"}
            </Button>



          <div className={styles.progress} style={{ marginLeft: "auto" }}>
            <RingProgress
              style={{ marginLeft: 28 }}
              size={media ? 80 : 100}
              sections={[
                {
                  value: (timeLeft / timeBetweenQuestions) * 100,
                  color: timeLeft < 10 ? "red" : "blue",
                },
              ]}
              label={
                <Text align="center" size={media ? "sm" : "md"}>
                  {timeLeft} sec
                </Text>
              }
            />
          </div>

      </Flex>
    );
  }


  return (
    <>
      <div className={styles.qution_mtop}>
        <Flex
          align="center"
          justify="space-between"
          style={{ height: 85, marginTop: 80, flexDirection: "column" }}
          className={styles.qution_mtop}
        >
          <Button
            onClick={uploadAnswer}
            disabled={isUploading}
            compact={media}
            className={styles.next}
          >
            <Loader color="blue" />
            {currectQuestion == totalQuestions - 1
              ? "Finish Interview"
              : "Next Question"}
          </Button>
        </Flex>
      </div>
    </>
  );
};

export default Mcq_controller;
