import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { useRouter } from "next/router";
import { useUserState } from "../hooks/useUserState";
import ForgotPassword from "../components/ForgotPassword";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80)",
  },

  form: {
    borderRight: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]}`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const Login = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const { user, loginUser } = useUserState();
  const details = useForm({
    initialValues: { email: "", password: "", rememberMe: false },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length < 4 ? "Password should be have atleast 4 letters" : null),
    },
  });
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  useEffect(() => {
    if (user !== null) {
      router.replace("/get-results");
     //router.replace("/assign-interview");
    }
  }, [user, router]);

  const handleLogin = async ({ email, password, rememberMe }: typeof details.values) => {
    try {
      setLoading(true);
      await loginUser(email, password, rememberMe);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <ForgotPassword isOpen={forgotPasswordModal} onDismiss={() => setForgotPasswordModal(false)} />
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
          Welcome to My CV Tracker
        </Title>
        <form onSubmit={details.onSubmit(handleLogin)}>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            {...details.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...details.getInputProps("password")}
          />
          <Checkbox label="Keep me logged in" mt="xl" size="md" {...details.getInputProps("rememberMe")} />
          <Button fullWidth mt="xl" size="md" type="submit" disabled={loading}>
            {loading ? <Loader color="white" /> : "Login"}
          </Button>
        </form>

        <Button mt="md" variant="subtle" onClick={() => setForgotPasswordModal(true)}>
          Forgot Password ?
        </Button>
      </Paper>
    </div>
  );
};

export default Login;
