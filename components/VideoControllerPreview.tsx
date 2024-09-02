import React, {useState, useEffect} from "react";
import { Alert, Button, Flex, Loader, RingProgress, Text, Title } from "@mantine/core";
import styles from "../styles/questionAdd.module.css";
import PrevResponse from "./PrevResponse";
import { useMediaQuery, useSetState } from "@mantine/hooks";
import { useUserState } from "../hooks/useUserState";
import { getCandidateDetails } from "../apis/mycvtracker/questions";


type Props = {
    timeLeft: number;
    operation: "startInterview" | "loading" | "recording" | "countdown" | "stopped";
    totalQuestions: number;
    currectQuestion: number;
    isUploading: boolean;
    startInterview: () => void;
    stopRecording: () => void;
    skipQuestion: () => void;
    uploadAnswer: () => void;
    blob: Blob | null;
    play: "play_rec" | "stop_recording" | "uploading"
};

const VideoController = ({
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
    totalQuestions
}: Props) => {

    const media = useMediaQuery("(max-width: 767px)");
    const { token } = useUserState();
    const [candName, setCandName] = useState();

    useEffect(() => {
        const getCanResults = async () =>{
        const queryParams = new URLSearchParams(window.location.search);//iterates over the search parameter
        const canToken = queryParams.get("token");
        try {
            const response = await getCandidateDetails(token, canToken);
            if (response) {
                setCandName(response.candidateName);
            }
          } catch (e: any) {
            console.log(e);
          }
        }
          getCanResults();
    },[])


    if (operation == "startInterview") {
        return (
            <>
            <div className={styles.rfire_fsize}>
                <p>Hi {candName}</p>
                <p>This is a rapid fire interview. Please make sure your microphone and webcam is enabled.</p>
            </div>
            <Flex align="center" justify="center" style={{ height: 362 }}>
                <div>
                    <button  className={styles.start_int_svg} onClick={startInterview}>
                        Start Interview
                    </button>
                </div>
            </Flex>
            </>
        );
    }

    if (operation === "loading") {
        return (
            <Flex align="center" justify="space-between">
                <Title order={3}>Loading Questions..</Title>
                <Loader size={70}/>
            </Flex>
        )
    }

    if (operation === "countdown") {
        <Flex align="center" justify="space-between" style={{ height: 85, flexDirection: 'column' }}>
            <div>
                <Title order={3} className={styles.record_fsize}>Recording Starts in</Title>
            </div>

            <div className = {styles.ring_animation}>
                <div className={styles.ring_transform} >
                    <div>
                        <div role="button" aria-pressed="false"></div>
                    </div>
                </div>
                <div className={styles.recording_starts}>
                    <span>{timeLeft} sec</span>
                </div>
                <button aria-label="Start recording" data-qa="record-button" className={styles.start_recording}>
                </button>
            </div>
        </Flex>
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
                >

                </Flex>
            </Flex>
        );
    }

    return (
        <>
            <Flex align="center" justify="space-between" style={{ height: 85, flexDirection: 'column' }}>


                <div className={styles.progress}>


                    {(play == 'stop_recording') ?
                        <> <span className={styles.record_fsize}>Recording Stopped.
                        </span>
                            {(currectQuestion == 0) && <div className={styles.listen_fsize}>Listen your recording.</div>}
                        </>
                        :
                        (play == 'uploading') ?
                            <> <span className={styles.recording_completed}>Wait... Uploading in progress... <span ><Loader /></span>
                            </span></>
                            :
                            <Title order={3} className={styles.record_fsize}>Recording started, please speak now.</Title>
                    }
                    {((play == 'stop_recording') && (currectQuestion == 0)) ?
                        <>
                            {/* <button aria-label="Replay your recording" className={styles.svg_icon}>
                        <svg fill="none" height="96" width="96" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" d="M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48z" fill="#fff" fill-rule="evenodd"></path>
                            <path clip-rule="evenodd" d="M37.326 33.822c0-2.408 2.695-3.835 4.687-2.481l20.862 14.178c1.752 1.19 1.752 3.772 0 4.963L42.013 64.66c-1.992 1.354-4.687-.072-4.687-2.48V33.821z" fill="#000" fill-rule="evenodd"></path>
                            </svg>
                            </button> */}
                            {blob && (
                                <div className={styles.preview}>
                                    <PrevResponse
                                        source={blob ? URL.createObjectURL(blob) : ""}
                                        compact={true}
                                        style={{ width: "100%", maxWidth: 300 }}

                                    />
                                </div>
                            )}
                        </> :
                        <>
                            <div className={styles.stoprec_wrapper}>
                                {((play == 'stop_recording' || play == 'uploading') && (currectQuestion == 0))
                                    ? '' :
                                    <div className={styles.rec__stop_transition} >
                                        <div className={styles.sec_bgclr}></div>
                                        <span className={styles.timeleft_block} > {timeLeft} sec </span><span className={styles.remaining}>remaining</span>
                                    </div>
                                }
                                <div>
                                    {play == 'play_rec' &&
                                        <>
                                            <button aria-label="Stop recording" data-qa="stop-button"  className={styles.play_stop_button}>

                                                <div className={styles.play_rec} ></div>
                                            </button>
                                        </>
                                    }
                                    {((currectQuestion != 0)) && (play == 'stop_recording' || play == 'uploading') &&
                                        <>
                                            <button aria-label="Stop recording" data-qa="stop-button"  className={styles.stop_button}>

                                                <div className={styles.stop_recording} ></div>
                                            </button>

                                        </>
                                    }

                                </div>

                            </div>
                        </>

                    }

                </div>

            </Flex>

        </>
    )
}

export default VideoController;