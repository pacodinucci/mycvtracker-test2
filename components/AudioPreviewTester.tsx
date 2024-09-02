"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useReactMediaRecorder } from 'react-media-recorder';
import Styles from '../styles/Audio.module.css';
import { useRouter } from "next/router";
import { rootCertificates } from 'tls';
import { useUserState } from "../hooks/useUserState";

type Props = {
  Url: string;
};


const AudioPreviewTester = () => {
  // const interviewMode = false;



  

  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

  return (
    <>
      <h1 className={Styles.text}>When you're ready, test your audio</h1>
      <br />
      <button onClick={startRecording} className={Styles.startRecording}>Start Recording</button>
      <br /><br />
      <button onClick={stopRecording} className={Styles.startRecording}>Stop Recording</button>
      <br /><br /> <br />
      <div>

        {mediaBlobUrl && (
          <audio
            src={mediaBlobUrl}
            controls
            className={Styles.audioplayer}
          />
        )}


      </div>
    </>
  );
};

export default AudioPreviewTester;
