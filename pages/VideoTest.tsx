import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import dynamic from "next/dynamic";
import { createRoot } from "react-dom/client";
import Styles from "../styles/Audio.module.css";
import { useRouter } from "next/router";

const VideoPreviewTest = dynamic(
  () => import("../components/VideoPreviewTest"),
  {
    ssr: false,
  }
);

const VideoTest = () => {
  const [displayAudio, setDisplayAudio] = useState(false);
  const router = useRouter();
  const { query } = router;
  const { interviewType, interviewMode, token } = query;

  const component =
    interviewMode === "AUDIO_VIDEO" ? "VideoInterview" : "FullVideo";

  const values = {
    interviewType,
    interviewMode,
    token,
    component,
  };

  useEffect(() => {
    // This code will only run on the client side
    const TestAudioSectionPreview = document.getElementById("TestAudioSection");
    const btn = document.getElementById("btn");

    const GiveAudio = () => {
      if (TestAudioSectionPreview) {
        const root = createRoot(TestAudioSectionPreview);
        root.render(<VideoPreviewTest values={values} />);
      }
    };

    // Add event listener
    if (btn) {
      btn.addEventListener("click", GiveAudio);
    }

    // Cleanup event listener
    return () => {
      if (btn) {
        btn.removeEventListener("click", GiveAudio);
      }
    };
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <>
      <div id="TestAudioSection" className={Styles.audioSection}>
        <h1>Hi</h1>
        <h1>Test your audio and video before you start your interview</h1>

        <button id="btn" className={Styles.startRecording}>
          Before you start Test your Video
        </button>
      </div>
    </>
  );
};

export default VideoTest;
