import React, { useState, useEffect } from "react";
import { Button, Flex, Loader, Title } from "@mantine/core";
import styles from "../styles/questionAdd.module.css";
import PrevResponse from "./PrevResponse";
import { useMediaQuery } from "@mantine/hooks";
import { useUserState } from "../hooks/useUserState";
import { getCandidateDetails } from "../apis/mycvtracker/questions";
import { useRouter } from "next/router";

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
    play: "play_rec" | "stop_recording" | "uploading";
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
    totalQuestions,
}: Props) => {

    const media = useMediaQuery("(max-width: 767px)");
    const { token } = useUserState();
    const [candName, setCandName] = useState<string | undefined>();
    const router = useRouter();

    useEffect(() => {
        const getCanResults = async () => {
            if (typeof window !== 'undefined') {
                const queryParams = new URLSearchParams(window.location.search);
                const canToken = queryParams.get("token");
                try {
                    const response = await getCandidateDetails(token, canToken);
                    if (response) {
                        setCandName(response.candidateName);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        };
        getCanResults();
    }, [token]);

    if (operation === "startInterview") {
        return (
            <>
                <div className={styles.rfire_fsize}>
                    <p>Hi {candName}</p>
                    <p>This is a rapid fire interview. Please make sure your microphone and webcam are enabled.</p>
                </div>
                <Flex align="center" justify="center" style={{ height: 362 }}>
                    <div>
                        <button className={styles.start_int_svg} onClick={startInterview}>
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
                <Loader size={70} />
            </Flex>
        );
    }

    if (operation === "countdown") {
        return (
            <Flex align="center" justify="space-between" style={{ height: 85, flexDirection: 'column' }}>
                <div>
                    <Title order={3} className={styles.record_fsize}>Recording Starts in</Title>
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
                    <button aria-label="Start recording" data-qa="record-button" className={styles.start_recording}>
                    </button>
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
                >
                    {/* Content for the stopped state */}
                </Flex>
            </Flex>
        );
    }

    return (
        <>
            <Flex align="center" justify="space-between" style={{ height: 85, flexDirection: 'column' }}>
                <div className={styles.progress}>
                    {play === 'stop_recording' ? (
                        <>
                            <span className={styles.record_fsize}>Recording Stopped.</span>
                            {currectQuestion === 0 && <div className={styles.listen_fsize}>Listen to your recording.</div>}
                        </>
                    ) : play === 'uploading' ? (
                        <>
                            <span className={styles.recording_completed}>
                                Wait... Uploading in progress... <span><Loader /></span>
                            </span>
                        </>
                    ) : (
                        <Title order={3} className={styles.record_fsize}>Recording started, please speak now.</Title>
                    )}
                    {play === 'stop_recording' && currectQuestion === 0 && blob ? (
                        <div className={styles.preview}>
                            <PrevResponse
                                source={blob ? URL.createObjectURL(blob) : ""}
                                compact={true}
                                style={{ width: "100%", maxWidth: 300 }}
                            />
                        </div>
                    ) : (
                        <div className={styles.stoprec_wrapper}>
                            {play === 'play_rec' && (
                                <button aria-label="Stop recording" data-qa="stop-button" className={styles.play_stop_button}>
                                    <div className={styles.play_rec}></div>
                                </button>
                            )}
                            {currectQuestion !== 0 && (play === 'stop_recording' || play === 'uploading') && (
                                <button aria-label="Stop recording" data-qa="stop-button" className={styles.stop_button}>
                                    <div className={styles.stop_recording}></div>
                                </button>
                            )}
                            {play !== 'stop_recording' && play !== 'uploading' && currectQuestion !== 0 && (
                                <div className={styles.rec__stop_transition}>
                                    <div className={styles.sec_bgclr}></div>
                                    <span className={styles.timeleft_block}>{timeLeft} sec</span><span className={styles.remaining}>remaining</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Flex>

            <div className={styles.qution_mtop}>
                <Flex align="center" justify="space-between" style={{ height: 85, marginTop: 240, flexDirection: "column" }} className={styles.qution_mtop}>
                    {play === 'play_rec' ? (
                        <Button onClick={stopRecording} disabled={isUploading} compact={media} className={styles.next}>Stop Recording</Button>
                    ) : (
                        <Button onClick={uploadAnswer} disabled={isUploading} compact={media} className={styles.next}>
                            {currectQuestion === totalQuestions - 1 ? "Finish Interview" : "Next Question"}
                        </Button>
                    )}
                </Flex>
            </div>
        </>
    );
};

export default VideoController;


