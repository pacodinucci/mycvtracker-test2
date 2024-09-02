import React from "react";

type Props = {
  label?: string;
  onDismiss?: () => void;
};

import { FaTimes } from "react-icons/fa";

const Chip = ({ label, onDismiss }: Props) => {
  return (
    <div className="btn btn-outline-primary mx-1" onClick={onDismiss}>
      {label} <FaTimes />
    </div>
  );
};

export default Chip;
