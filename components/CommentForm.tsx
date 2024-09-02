import React, { useState } from "react";
import {
  TextInput,
  Button,
  Textarea,
  Paper,
  Flex,
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUserState } from "../hooks/useUserState";

export interface OnSubmitParamsType {
  content: string;
  email: string;
  name: string;
}

interface CommentFormProps {
  onSubmit: (values: OnSubmitParamsType) => Promise<void>;
  initialValues: OnSubmitParamsType;
  readOnlyEmail: boolean;
}

const CommentForm = ({
  onSubmit,
  initialValues,
  readOnlyEmail,
}: CommentFormProps) => {
  const [isLoading, setLoading] = useState(false);

  const { user } = useUserState();

  const commentForm = useForm({
    initialValues: {
      ...initialValues,
    },
    validate: {
      content: (value) =>
        value.length <= 1 ? "Content cannot be empty" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      name:  (value) => value.length <= 1 ? "Name cannot be empty" : null
    },
  });

  type CommentFormType = typeof commentForm.values;

  const handleOnsubmit = async (
    values: CommentFormType,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (isLoading) return;
    try {
      setLoading(true);
      await onSubmit(values);
    } catch (error) {
      console.log(error);
    } finally {
      commentForm.reset();
      setLoading(false);
    }
  };

  return (
    <Paper m="xl" radius="md">
      <form onSubmit={commentForm.onSubmit(handleOnsubmit)}>
        <SimpleGrid cols={user ? 1 : 2} spacing="sm" verticalSpacing="xs">
          {!user && (
            <TextInput
              width={"50%"}
              placeholder="Your Name"
              radius="xs"
              withAsterisk
              {...commentForm.getInputProps("name")}
            />
          )}
          <TextInput
            style={{ display : "none" }}
            placeholder="Your email"
            radius="xs"
            withAsterisk
            {...commentForm.getInputProps("email")}
            readOnly={readOnlyEmail}
          />
        </SimpleGrid>
        <Textarea
          mt="lg"
          placeholder="Content"
          withAsterisk
          autosize
          minRows={4}
          maxRows={8}
          {...commentForm.getInputProps("content")}
        />
        <Button
          w={150}
          type="submit"
          variant="filled"
          my="sm"
          loading={isLoading}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
};

export default CommentForm;
