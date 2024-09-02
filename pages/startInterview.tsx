"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const StartInterview = () => {
  const router = useRouter();

  const { query } = router;
  const { interviewMode } = query;

  useEffect(() => {
    if (interviewMode === "AUDIO") {
      router.push(
        `/AudioTest?token=${query.token}&interviewType=${query.interviewType}`
      );
    } else if (interviewMode === "AUDIO_VIDEO") {
      router.push(
        `/VideoTest?token=${query.token}&interviewType=${query.interviewType}&interviewMode=${interviewMode}`
      );
    } else if (interviewMode === "AUDIO_FEEDBACK") {
      console.log("Should redirect to AUDIO_FEEDBACK");
    } else if (interviewMode === "MCQ") {
      console.log("Should redirect to MCQ");
    } else if (interviewMode === "AUDIO_WITH_HR") {
      console.log("Should redirect to AUDIO_WITH_HR");
    } else if (interviewMode === "MCQ_WITH_HR") {
      console.log("Should redirect to MCQ_WITH_HR");
    } else if (interviewMode === "VIDEO") {
      console.log("Should redirect to VIDEO");
    } else if (interviewMode === "VIDEO_WITH_HR") {
      console.log("Should redirect to VIDEO_WITH_HR");
    } else if (interviewMode === "FULL_VIDEO") {
      router.push(
        `/VideoTest?token=${query.token}&interviewType=${query.interviewType}`
      );
    } else if (interviewMode === "FULL_VIDEO_WITH_HR") {
      console.log("Should redirect to FULL_VIDEO_WITH_HR");
    }
  }, [router]);
  //Hello
  return null;
};

export default StartInterview;
