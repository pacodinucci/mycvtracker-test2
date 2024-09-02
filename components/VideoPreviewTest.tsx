import React, { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import Webcam from "react-webcam";
type Operation =
  | "startInterview"
  | "loading"
  | "recording"
  | "countdown"
  | "stopped";
import Styles from "../styles/Video.module.css";
import Style from "../styles/Audio.module.css";
type Link = {
  Url: string;
};
import { Flex } from "@mantine/core";

const VideoPreviewTester = (values: any) => {
  console.log(values.values.token);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true, audio: true });
  const video = document.getElementById("video");
  const videoConstraints = {
    width: 500,
    height: 380,
    facingMode: "user",
  };
  const [show, setShow] = useState(true);
  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // const [operation, setOperation] = useState<Operation>("startInterview");
  const [proceedbtn, setProceedBtn] = useState(false);

  useEffect(() => {
    const StartRecordbtn = document.getElementById("StartRecord");
    const StopRecordbtn = document.getElementById("StopRecord");

    StartRecordbtn?.addEventListener("click", () => {
      startRecording();
      setShow(true);
      setProceedBtn(false);
    });

    StopRecordbtn?.addEventListener("click", () => {
      setShow(false);
      stopRecording();
      setProceedBtn(true);
    });
    // Cleanup event listeners on component unmount
    return () => {
      StartRecordbtn?.removeEventListener("click", startRecording);
      StopRecordbtn?.removeEventListener("click", stopRecording);
    };
  }, [startRecording, stopRecording]);

  return (
    <>
      <div className={Style.audioSection}>
        <h1 className={Styles.text}>Test Your Video When You're Ready</h1>
        <Flex
          mih={50}
          gap="xl"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <button
            id="StartRecord"
            className={`${Styles.startButton} ${Styles.button} ${Styles.text} ${Styles.buttonContainer}`}
          >
            Start Recording
          </button>
          <button
            id="StopRecord"
            className={`${Styles.stopButton} ${Styles.button}  ${Styles.text} ${Styles.buttonContainer}`}
          >
            Stop Recording
          </button>
        </Flex>
        {/* Display the recorded video */}
        {!show && (
          <>
            <Flex
              mih={50}
              gap="xl"
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
            >
              {mediaBlobUrl && (
                <video
                  id="video"
                  className={Styles.videoSize}
                  src={mediaBlobUrl}
                  controls
                />
              )}
            </Flex>
          </>
        )}
      </div>

      {show && (
        <>
          <Webcam videoConstraints={videoConstraints} />
        </>
      )}

      <br />

      {proceedbtn && (
        <>
          <button>
            <a
              href={`http://localhost:3000/interview-app/${values.values.component}?token=${values.values.token}&interviewType=${values.values.interviewType}&interviewMode=${values.values.InterviewMode}`}
              // target="_blank"
              rel="noopener noreferrer"
              className={Styles.linkText}
            >
              Proceed to interview
            </a>
          </button>
        </>
      )}
    </>
  );
};
export default VideoPreviewTester;
