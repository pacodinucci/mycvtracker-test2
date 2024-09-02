import { Box, Highlight, List, Stack, Title } from "@mantine/core";
import React from "react";
type Props = {
  timeBetweenQuestions?: number;
};


const Instructions = (props: Props) => {
  const { timeBetweenQuestions = 60 } = props
  return (
    <Box p="sm">
      <Title>Instructions</Title>
      <Stack spacing="md">
        <Highlight highlight={`${timeBetweenQuestions} seconds`}>
          {`You have ${timeBetweenQuestions} seconds to answer each question, Please ensure access to your microphone is enabled to confirm
          that your response will be recorded.`}
        </Highlight>
        <p>
          Use the demo question to practice your response, and get more comfortable with the method of the audio
          interview.
        </p>
        <p>
          You can playback your recording to determine if you are satisfied with the audio, and then ensure you upload
          your answer to the server to confirm your answer before moving to next Question.
        </p>
        <p>Please note you need to record answer and submit answer at each question before moving to next question.</p>
        <p>Recording Starts automatically, a 10 second cooldown is given, before recording starts</p>
        <p>Continue this process until you have answered all the questions!</p>
      </Stack>
    </Box>
  );
};

export default Instructions;
