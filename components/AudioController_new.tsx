import {
  Alert,
  Button,
  Flex,
  Loader,
  RingProgress,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery, useSetState } from "@mantine/hooks";
import React, { useState } from "react";
import { FaCircle } from "react-icons/fa";
import PrevResponse from "./PrevResponse";
import styles from "../styles/questionAdd.module.css";
import alanBtn from "@alan-ai/alan-sdk-web";
import { useEffect } from "react";
import audio from "../assets/homepage/audio.svg";
import { useRouter } from "next/router";
import { getCandidateDetails } from "../apis/mycvtracker/questions";
import { useUserState } from "../hooks/useUserState";

// import { useSpeechSynthesis } from "react-speech-kit";

type Props = {
  timeLeft: number;
  operation:
    | "startInterview"
    | "loading"
    | "recording"
    | "countdown"
    | "stopped";
  totalQuestions: number;
  currectQuestion: number;
  isUploading: boolean;
  startInterview: () => void;
  stopRecording: () => void;
  skipQuestion: () => void;
  uploadAnswer: () => void;
  blob: Blob | null;
  play: "play_rec" | "stop_recording" | "uploading";
  //  currentUrl:string
};

const AudioController_new = ({
  timeLeft,
  operation,
  blob,
  startInterview,
  stopRecording,
  skipQuestion,
  uploadAnswer,
  isUploading,
  play,
  currectQuestion,
  totalQuestions,
}: Props) => {
  // const { speak } = useSpeechSynthesis();
  const media = useMediaQuery("(max-width: 767px)");
  const router = useRouter();
  const { token } = useUserState();
  const [candName, setCandName] = useState();
  useEffect(() => {
    const getCanResults = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const canToken = queryParams.get("token");
      try {
        const response = await getCandidateDetails(token, canToken);
        if (response) {
          setCandName(response.candidateName);
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    getCanResults();
  }, []);

  useEffect(() => {
    console.log(play);
  }, [play]);

  if (operation === "startInterview") {
    return (
      <>
        {/* <div className={styles.fire_fsize}>Hi {candName}</div> */}
        <div className={styles.rfire_fsize}>
          <span className={styles.canName}>Hi {candName}</span>
          <br></br>
          <span>
            This is rapid fire interview. Please make sure your microphone is
            enabled.
          </span>
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
      <Flex
        align="center"
        justify="space-between"
        style={{ height: 85, flexDirection: "column" }}
      >
        <div>
          <Title order={3} className={styles.record_fsize}>
            Recording Starts in
          </Title>
        </div>

        <div className={styles.ring_animation}>
          <div className={styles.ring_transform}>
            <div>
              <div role="button" aria-pressed="false"></div>
            </div>
          </div>
          <div className={styles.recording_starts}>
            <span>{timeLeft} sec</span>
          </div>
          <button
            aria-label="Start recording"
            data-qa="record-button"
            className={styles.start_recording}
          ></button>
          {/* <button aria-label="Go back" className={styles.bXpOWr}>
                        <svg height="12" width="12" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M1.707.293A1 1 0 00.293 1.707L4.536 5.95.293 10.192a1 1 0 101.414 1.415L5.95 7.364l4.242 4.243a1 1 0 001.415-1.415L7.364 5.95l4.243-4.243A1 1 0 0010.193.293L5.95 4.536 1.707.293z" fill-rule="evenodd">
                        </path></svg>

                        </button> */}
        </div>
      </Flex>
    );
  }

  if (operation === "stopped") {
    return (
      <Flex align="center" justify="flex-start" style={{ height: 85 }}>
        <Flex
          align="center"
          justify="space-between"
          direction={{ base: "column", xs: "row" }}
          gap={{ base: 2, sm: "lg" }}
          style={{ marginTop: 32 }}
        ></Flex>
      </Flex>
    );
  }

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        style={{ height: 85, flexDirection: "column" }}
      >
        <div className={styles.progress}>
          {play == "stop_recording" ? (
            <>
              {" "}
              <span className={styles.record_fsize}>Recording Stopped.</span>
            </>
          ) : play == "uploading" ? (
            <>
              {" "}
              <span className={styles.recording_completed}>
                Wait... Uploading in progress...{" "}
                <span>
                  <Loader />
                </span>
              </span>
            </>
          ) : (
            <Title order={3} className={styles.record_fsize}>
              Recording started, please speak now.
            </Title>
          )}
          {play == "stop_recording" && currectQuestion == 0 ? (
            <>
              {/* <button aria-label="Replay your recording" className={styles.svg_icon}>
                        <svg fill="none" height="96" width="96" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" d="M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48z" fill="#fff" fill-rule="evenodd"></path>
                            <path clip-rule="evenodd" d="M37.326 33.822c0-2.408 2.695-3.835 4.687-2.481l20.862 14.178c1.752 1.19 1.752 3.772 0 4.963L42.013 64.66c-1.992 1.354-4.687-.072-4.687-2.48V33.821z" fill="#000" fill-rule="evenodd"></path>
                            </svg>
                            </button> */}
              {blob && (
                <div className={styles.preview}>
                  {/* <PrevResponse
                                        source={blob ? URL.createObjectURL(blob) : ""}
                                        compact={true}
                                        style={{ width: "100%", maxWidth: 300 }}

                                    /> */}
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.stoprec_wrapper}>
                {(play == "stop_recording" || play == "uploading") &&
                currectQuestion == 0 ? (
                  ""
                ) : (
                  <div className={styles.rec__stop_transition}>
                    <div className={styles.sec_bgclr}></div>
                    <span className={styles.timeleft_block}>
                      {" "}
                      {timeLeft} sec{" "}
                    </span>
                    <span className={styles.remaining}>remaining</span>
                  </div>
                )}
                <div>
                  {play == "play_rec" && (
                    <>
                      <button
                        aria-label="Stop recording"
                        data-qa="stop-button"
                        className={styles.play_stop_button}
                      >
                        <div className={styles.play_rec}></div>
                      </button>
                    </>
                  )}
                  {currectQuestion != 0 &&
                    (play == "stop_recording" || play == "uploading") && (
                      <>
                        <button
                          aria-label="Stop recording"
                          data-qa="stop-button"
                          className={styles.stop_button}
                        >
                          <div className={styles.stop_recording}></div>
                        </button>
                      </>
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </Flex>

      <div className={styles.qution_mtop}>
        <Flex
          align="center"
          justify="space-between"
          style={{ height: 85, marginTop: 240, flexDirection: "column" }}
          className={styles.qution_mtop}
        >
          {play == "play_rec" ? (
            <Button
              onClick={stopRecording}
              disabled={isUploading}
              compact={media}
              className={styles.next}
            >
              {" "}
              Stop Recording{" "}
            </Button>
          ) : play == "stop_recording" ? (
            <Button
              onClick={uploadAnswer}
              disabled={isUploading}
              compact={media}
              className={styles.next}
            >
              {currectQuestion == totalQuestions - 1
                ? "Finish Interview"
                : "Next Question"}
            </Button>
          ) : (
            <Button
              onClick={uploadAnswer}
              disabled={isUploading}
              compact={media}
              className={styles.next}
            >
              {currectQuestion == totalQuestions - 1
                ? "Finish Interview"
                : "Next Question"}
            </Button>
          )}
        </Flex>
      </div>
    </>
  );
};

export default AudioController_new;
