import React, { useState } from "react";
import { Button } from "@mui/material";
import FromCustom from "./From";
import { toast } from "react-toastify";
import { apiCreateAccount } from "../../../service/api/account";

function Create({ handleGetList }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (data) => {
    try {
      const response = await apiCreateAccount(data);
      if (response.data.status === 200) {
        toast.success(response.data.message);
        handleGetList();
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống bảo trì!");
      return { success: false };
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        type="button"
        variant="contained"
        color="primary"
        className="ml-2"
      >
        Thêm mới
      </Button>
      {open && (
        <FromCustom
          open={open}
          onClose={handleClose}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
}

export default Create;
