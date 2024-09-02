import { TextInput, Container, Alert, ActionIcon, useMantineTheme, Loader, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { getInterviewResponses } from "../apis/mycvtracker";
import PrevResponse from "../components/PrevResponse";
import { AudioResponse } from "../types/audioResponse_types";

import { FaSearch, FaArrowRight } from "react-icons/fa";
interface TokenDisplayProps {
  token: string;
}
const Responses: React.FC<TokenDisplayProps> = ({ token }) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [responses, setResponses] = useState<{ data: AudioResponse[]; loading: boolean }>({ data: [], loading: false });
 
  const details = useForm({
    initialValues: {
      token: "",
    },
    validate: {
      token: (value) => (value.length < 5 ? "Please enter a valid token" : null),
    },
  });

  type DetailsType = typeof details.values;

  const fetchResponse = useCallback(async ({ token }: DetailsType) => {
    try {
      setResponses((prev) => ({ ...prev, loading: true }));
      const response = await getInterviewResponses(token);
      setResponses({ data: response.data, loading: false });
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (router.query.token) {
      if (!Array.isArray(router.query.token)) {
        fetchResponse({ token: router.query.token });
        router.replace(router.asPath, router.route, { shallow: true });
      }
    }
  }, [router, fetchResponse]);

  return (
    <Container>
      <Title order={1}>Responses</Title>
      <form onSubmit={details.onSubmit(fetchResponse)}>
        <TextInput
          disabled={responses.loading}
          radius="xl"
          size="md"
          my="md"
          {...details.getInputProps("token")}
          icon={<FaSearch size={18} />}
          rightSection={
            responses.loading ? (
              <Loader />
            ) : (
              <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled" type="submit">
                <FaArrowRight />
              </ActionIcon>
            )
          }
        />
      </form>
      {responses.loading && <p>Loading</p>}
      {!responses.loading && responses.data.length === 0 && <Alert mt="md">Wrong token or no response</Alert>}
      {!responses.loading &&
        responses.data.length > 0 &&
        responses.data.map((response) => <PrevResponse data={response} key={response.questionId} />)}
    </Container>
  );
};

export default Responses;
