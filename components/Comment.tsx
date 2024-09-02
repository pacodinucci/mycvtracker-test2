import React from "react";
import { Text, Paper, Divider } from "@mantine/core";
import { Reply } from '../types/question_types';

interface CommentProps  {
  comment: Reply,
  thirdPartyName: string
}

const Comment = ({ comment, thirdPartyName }: CommentProps) => {
  return (
    <>
      <Paper m="xl" radius="md">
        <div>
          <Text c="blue" fw={500} size="md">
            {comment?.userId === 0 ? ( comment.userName) : comment.userName }
          </Text>
          <Text size="xs" color="dimmed" mt={2}>
          {new Date(comment?.uploadedAt).toDateString()}
          </Text>
        </div>
        <Text mt="lg" mb={5} size="md">
          {comment.replyContent}
        </Text>
      </Paper>
      <Divider my="sm" />
    </>
  );
};

export default Comment;
