import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  ActionIcon,
  Button,
  Flex,
  Paper,
  SimpleGrid,
  Slider,
  Text,
  Title,
  Alert,
  Group,
  Skeleton,
} from "@mantine/core";
import { AudioResponse } from "../types/audioResponse_types";
import ReactHowler from "react-howler";

import {
  FaPlay,
  FaPause,
  FaStop,
  FaVolumeOff,
  FaVolumeMute,
  FaVolumeUp,
  FaVolumeDown,
  FaRedo,
} from "react-icons/fa";
import { Question } from "../types/question_types";
import { getMyQuestions, getQuestionById } from "../apis/mycvtracker/questions";

type Props = {
  data?: AudioResponse;
  source?: string;
  compact?: boolean;
  style?: {
    width: number | string;
    maxWidth: number | string;
  };
};

interface Howler extends ReactHowler {
  load: () => void;
}

const MCQResponse = ({ data, source, compact, style }: Props) => {
  const player = useRef<Howler | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<Question>({
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  } as Question);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!data) {
        return;
      }
      setIsLoading(true);
      const question = await getQuestionById(data.questionId);
      setQuestion(question);
      setIsLoading(false);
    };

    fetchQuestion();
  }, [data]);

  const { option1, option2, option3, option4, correct } = question;
  const options = [option1, option2, option3, option4];

  const correctAns = options.findIndex((item) => item === correct);
  const choosenAns = options.findIndex((item) =>
    item === data?.answerLocation
  );

  return (
    <Paper p={compact ? "sm" : "md"} my={compact ? "sm" : "md"} style={style}>
      <Text fz="sm" style={{ marginTop: 16 }}>
        {data && <Title order={6}>{data.question}</Title>}
      </Text>

      {isLoading && (
        <>
          <Skeleton height={25} width={"75%"} radius="sm" mt={10} />
          <Skeleton height={25} width={"75%"} radius="sm" mt={10} />
          <Skeleton height={25} width={"75%"} radius="sm" mt={10} />
          <Skeleton height={25} width={"75%"} radius="sm" mt={10} />
        </>
      )}

      <div>
        {!isLoading &&
          options.map((option, idx) => {
            const color =
              correctAns === idx ? "green" : choosenAns === idx ? "red" : "";
            const inCorrect = correctAns !== choosenAns;

            return (
              <Text
                fw={color ? 500 : "normal"}
                color={color}
                key={`option-${idx + 1}`}
              >
                {option}{" "}
                {choosenAns == idx && inCorrect && (
                  <Text component="span" color="red" fs="italic" fw="normal">
                    {" "}
                    (incorrect)
                  </Text>
                )}
              </Text>
            );
          })}
      </div>
    </Paper>
  );
};

export default MCQResponse;
