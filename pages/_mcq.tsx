import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Alert, Button, Container, Header, Box, Modal, Flex, Title, Progress, Text, Checkbox, Radio, LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";
import { getCandidateDetails, getMyMCQuestions } from '../apis/mycvtracker/questions';
import { Candidatedata, Question } from "../types/question_types";
import { submitMCQAnswer } from "../apis/mycvtracker/submit_interview";
import styles from "../styles/questionAdd.module.css";
import { useUserState } from "../hooks/useUserState";
import Mcq_controller from "./mcq_controller";
import MCQInstructions from "../components/MCQInstructions";


const MAX_AUDIO_DURATION = 60;

type Operation = "startInterview" | "loading" | "countdown" | "stopped";
type play = "play_rec" | "stop_recording" | "uploading";


const defaultAnswer = {
  option1: false,
  option2: false,
  option3: false,
  option4: false,
}

type AnswerOption = keyof typeof defaultAnswer;
const Mcq_interview = () => {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [types, setTypes] = useState<string[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currectQuestion, setCurrentQuestion] = useState<number>(-1);
    const [countDownTimer, setCountDownTimer] = useState(5);
    const [_, setCountdownInterval] = useState<NodeJS.Timer | null>(null);
    const [operation, setOperation] = useState<Operation>("startInterview");
    const [showInstructions, setShowInstructions] = useState(false);
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [play, setPlay] = useState<play>("play_rec");
    const { user, isLoading: isLoadingUser } = useUserState();
    const [answer, setAnswer] = useState(defaultAnswer);
    const [candidate, setCandidate] = useState<Candidatedata>({timeBetweenQuestions: 60} as Candidatedata);
    const [isPreparing, setIsPreparing] = useState(false);

    useEffect(() => {
      const prepareInterview = async () => {
        if (router.query.token) {
          if (!Array.isArray(router.query.token)) {

            setIsPreparing(true)
            const candToken = router.query.token;
            setToken(candToken);
            router.replace(router.asPath, router.route, { shallow: true });
            try {

              const response = await getCandidateDetails("", candToken);
              setCandidate(response);
            } catch (e: any) {
              console.log(e);
            } finally {
              setIsPreparing(false)
              setTimeout(() => {
                setShowInstructions(true)
              }, 100);
            }
          }
        }

        if (router.query.interviewType) {
          console.log(router.query.interviewType);
          setTypes(Array.isArray(router.query.interviewType) ? router.query.interviewType : [router.query.interviewType]);
        }
      }

      prepareInterview()


    }, [router]);

    const {timeBetweenQuestions} = candidate

    const startCountdown = useCallback(() => {
        setCountDownTimer(timeBetweenQuestions);
        const time = setInterval(() => {
            setCountDownTimer((prev) => prev - 1);
        }, 1000);
        setCountdownInterval((prev) => {
            if (prev !== null) clearInterval(prev);
            return time;
        });
        setOperation("countdown");
    }, [timeBetweenQuestions]);


    const handleSubmitAnswer = useCallback(
      async () => {
        if (isUploading) {
          return
        }
        setPlay("uploading");
        setIsUploading(true)
        try {
          const itwQuestion = questions[currectQuestion]
        const option = Object.keys(answer).find((opt) => !!answer[opt as AnswerOption])
        const optionValue = option ? itwQuestion?.[option as AnswerOption] : ""
        const questionId =  itwQuestion?.id
        setCountdownInterval((prev) => {
          if (prev !== null) clearInterval(prev);
          return null;
        });
        if(!questionId) return;
        await submitMCQAnswer(token, itwQuestion?.id, optionValue)
        setAnswer(defaultAnswer)
        setOperation("countdown");
        startCountdown();
        setCurrentQuestion((prev) => prev + 1);
        } catch (error) {
          console.log("error");
        } finally {
          setIsUploading(false)
        }

      },
      [answer, currectQuestion, isUploading, questions, startCountdown, token],
    )


    const startInterview = useCallback(
        (startfrom: number) => {
            setCurrentQuestion(startfrom);
            startCountdown();
        },
        [startCountdown]
    );

    useEffect(() => {
        if (countDownTimer <= 0) {
            if (operation === "countdown") {

              setCountdownInterval((prev) => {
                if (prev !== null) clearInterval(prev);
                return null;
              });

              //Submit answer when time up
              if (!isUploading) {
                handleSubmitAnswer()
              }
            }
        }
    }, [countDownTimer, handleSubmitAnswer, isUploading, operation]);

    const getQuestions = useCallback(
        async (token: string, types: string[]) => {
            try {
                const mcQuestions : Question[] = await getMyMCQuestions(token, types.join("_"));
                if (mcQuestions) {


                  const currentQuesIdx = mcQuestions.findIndex(question => !question.answered);
                  console.log({mcQuestions, currentQuesIdx});

                  startInterview(currentQuesIdx !== -1 ? currentQuesIdx : mcQuestions.length);
                  setQuestions(mcQuestions);
                }
            } catch (e: any) {
                setToken("");
                console.log(e);
            }

        },
        [startInterview]
    );

    const handleStartInterview = useCallback(
        (token: string, types: string[]) => {
            // if (hasPermission && types.length > 0 && token.length > 2) {
            setOperation("loading");
            getQuestions(token, types);
            //   } else {
            //     // Throw Error
            //   }
        },
        [getQuestions]
    );

    const skipQuestion = useCallback(() => {
        // stopRecording();
        startCountdown();
        setCurrentQuestion((prev) => prev + 1);
    }, [startCountdown]);

    if (questions.length > 0 && currectQuestion >= questions.length) {
        return (
            <Container>
                <Title order={1} align="center">
                    Thank you for attending the interview
                </Title>
                <Title order={3} align="center">
                    Our team will evalute the answers and get back to you
                </Title>
                <Title order={6} align="center">
                    If you have any doubts, you can contact us at info@mycvtracker.com
                </Title>
            </Container>
        );
    }


    const itwQuestion = questions[currectQuestion]
    const isChoosen = Object.values(answer).some(value => value)

    return (
        <Box>
           <LoadingOverlay visible={isPreparing} zIndex={99999} />
            <Modal opened={showInstructions && !isPreparing} onClose={() => setShowInstructions(false)} size="xl">
                <MCQInstructions timeBetweenQuestions={timeBetweenQuestions}/>
            </Modal>
            <Box pt={85} />
            <Header fixed={true} height={140} mt={70} p={0} style={{ zIndex: 9, maxHeight: 500, height: 555 }}>
                <Flex direction="column" p="sm">
                    <Flex direction="row" align="center" justify="space-between" gap="lg">
                        {(operation !== 'startInterview') &&
                            <Flex style={{ width: "100%" }} direction="column">
                                <Progress
                                    value={(currectQuestion / questions.length) * 100}
                                    style={{ width: "100%", maxWidth: 300, height: 12, marginTop: 10, marginLeft: 10 }}
                                    size="sm"
                                />
                                <Text fz="sm" className={styles.quetion_bold} style={{ marginLeft: 10 }}>{`Question  : ${currectQuestion + 1} of ${questions.length}`}</Text>

                            </Flex>
                        }
                        {!isPreparing && (operation === 'startInterview') && <Button size="xs" className={styles.instructions_btn} onClick={() => setShowInstructions(true)} style={{ alignSelf: "flex-end" }}>
                            Show Instructions
                        </Button>
                        }
                    </Flex>

                    <div className={styles.quetion_total}>{currectQuestion > -1 && itwQuestion?.question}
                        {currectQuestion > -1 && <div className={styles.mcq_checkbox}>

                        {Object.entries(answer).map(([option, value]) => {
                          return <Radio
                          key={option}
                          onChange={(event) => setAnswer({...defaultAnswer, [option] : event.currentTarget.checked})}
                          mt={16}
                          label={itwQuestion?.[option as AnswerOption]}
                          checked={value}
                      />
                        })}

                        </div>
                        }
                    </div>


                    <Mcq_controller
                        operation={operation}
                        isChoosen={isChoosen}
                        totalQuestions={questions.length}
                        currectQuestion={currectQuestion}
                        timeBetweenQuestions={timeBetweenQuestions}
                        timeLeft={countDownTimer}
                        isUploading={isUploading}
                        startInterview={() => handleStartInterview(token, types)}
                        skipQuestion={skipQuestion}
                        uploadAnswer={handleSubmitAnswer}
                        play={play}
                    />

                </Flex>
            </Header>
            <Container style={{ marginTop: 50 }}>
                {token.length < 1 && (
                    <Alert title="Invalid Token" color="red">
                        Invalid Token, Please Check the link. Please check the link.
                    </Alert>
                )}
                {types.length < 1 && (
                    <Alert title="No Interview Types" color="red">
                        No Interview types detected. Please check the link.
                    </Alert>
                )}

                {/* <div className={styles.quetion_fsize}>{currectQuestion > -1 && questions[currectQuestion].question}</div> */}
            </Container>
        </Box>
    );
};

export default Mcq_interview;
