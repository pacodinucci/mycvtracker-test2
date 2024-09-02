import React, { useCallback, useState } from "react";

import { Modal, TextInput, Button } from "@mantine/core";
import { sendForgotPasswordRequest } from "../apis/mycvtracker";
import { useToast } from "../hooks/useToast";

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
};

const ForgotPassword = ({ isOpen, onDismiss }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { showSuccessToast, showErrorToast } = useToast();

  const handleClick = useCallback(
    async (_email: string) => {
      try {
        setLoading(true);
        await sendForgotPasswordRequest(_email);
        onDismiss();
        showSuccessToast("Password reset email sent.");
      } catch (e: any) {
        showErrorToast(e.message);
      } finally {
        setLoading(false);
      }
    },
    [onDismiss, showSuccessToast, showErrorToast]
  );

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <Modal opened={isOpen} onClose={onDismiss} title="Forgot Password">
      <TextInput
        name="forgotEmail"
        label="Email"
        type="email"
        id="forgotEmail"
        value={email}
        onChange={handleChangeInput}
      />
      <Button disabled={loading} onClick={() => handleClick(email)} mt="md">
        Reset Password
      </Button>
    </Modal>
  );
};

export default ForgotPassword;
