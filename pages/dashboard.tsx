import Link from "next/link";
import React from "react";
import { Container, Paper, Title } from "@mantine/core";
import { useUserState } from "../hooks/useUserState";

const Account = () => {
  const { user } = useUserState();

  return (
    <Container>
      <Title order={1}>Dashboard</Title>
      <Title order={4} align="center">
        Welcome {user?.email}
      </Title>
      {/* <Paper p="md" my="md">
        <Link href="/assign-interview">Assign Interview</Link>
      </Paper> */}
      <Paper p="md" my="md">
        <Link href="/get-results">Employer Interviews</Link>
      </Paper>
      <Paper p="md" my="md">
        <Link href="/get-refresults">Referral Interviews</Link>
      </Paper>
      <Paper p="md" my="md">
        <Link href="/employer-data">Employer Data</Link>
      </Paper>
      {/* <Paper p="md" my="md">
        <Link href="/responses">Responses</Link>
      </Paper> */}
    </Container>
  );
};

export default Account;
