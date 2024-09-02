import { Box, Highlight, List, Stack, Title } from "@mantine/core";
import React from "react";


type Props = {
  timeBetweenQuestions: number;
};

const MCQInstructions = (props : Props) => {
  const { timeBetweenQuestions } = props
  return (
    <Box p="sm">
      <Title>Instructions</Title>
      <Stack spacing="md">
        <Highlight highlight={`${timeBetweenQuestions} seconds`}>
          {`You have ${timeBetweenQuestions} seconds to answer each question`}
        </Highlight>
        <p>
          Use the demo question to practice your response, and get more comfortable with the method of the multiple choice
          interview.
        </p>

        <p>Please note you need to choose answer and submit answer at each question before moving to next question.</p>

        <p>Continue this process until you have answered all the questions!</p>
      </Stack>
    </Box>
  );
};

export default MCQInstructions;
