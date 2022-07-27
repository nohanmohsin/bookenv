import React from "react";
import crossIcon from "../../icons/cross-icon.svg";

const CloseDialogBtn = ({ dialogRef }) => {
  return (
    <img
      src={crossIcon}
      alt=""
      className="close-dialog"
      onClick={() => {
        dialogRef.current.close();
      }}
      width={40}
      height={40}
    />
  );
};

export default CloseDialogBtn;
