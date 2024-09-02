import React, { useState } from "react";
import { Text, Paper, Divider, Anchor, Group } from "@mantine/core";
import { IconCornerDownRight } from "@tabler/icons-react";
import Comment from "./Comment";
import {
  Comment as CommentType,
  InterviewSharing,
  Reply,
} from "../types/question_types";
import { createReply, getReplies } from "../apis/mycvtracker";
import CommentForm, { OnSubmitParamsType } from "./CommentForm";
import { useUserState } from "../hooks/useUserState";

interface RootCommentProp {
  comment: CommentType;
  interviewSharing: InterviewSharing;
}

const RootComment = ({ comment, interviewSharing }: RootCommentProp) => {
  const [replies, setRelies] = useState<Reply[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const { token, user } = useUserState();
  const handleCommentFormSubmit = async (values: OnSubmitParamsType) => {
    await createReply({
      email: values.email,
      reviewId: comment.id,
      name: values.name,
      content: values.content,
    });
    const replies = await getReplies(comment.id);
    setRelies(replies.data);
  };

  return (
    <Paper m="xl" radius="md" p="md">
      <div>
        <Text c="blue" fw={500} size="md">
          {comment?.reviewerName}
        </Text>
        <Text size="xs" color="dimmed" mt={2}>
          {new Date(comment?.uploadedAt).toDateString()}
        </Text>
      </div>
      <Text mt="lg" mb="lg" size="md">
        {comment.resumeReview}
      </Text>
      {showReplies && (
        <>
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              thirdPartyName={interviewSharing.partyName}
            />
          ))}
          <CommentForm
            onSubmit={handleCommentFormSubmit}
            initialValues={{
              email: user?.email || interviewSharing.partyEmail,
              name:  user ? user.firstName + user.lastName : "",
              content: "",
            }}
            readOnlyEmail
          />
          <Divider my="sm" mt={5} />
        </>
      )}

      {!showReplies && (
        <>
          <Anchor
            onClick={async () => {
              const replies = await getReplies(comment.id);
              setRelies(replies.data);
              setShowReplies(true);
            }}
          >
            <Group>
              <IconCornerDownRight />
              {comment.noOfReply || "0"} comments - Reply
            </Group>
          </Anchor>
          <Divider my="sm" mt={5} />
        </>
      )}
    </Paper>
  );
};

export default RootComment;
