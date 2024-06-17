import React, { useState } from "react";
import FromCustom from "./From";
import { toast } from "react-toastify";
import { apiForgotpassword } from "../../../service/api/account";
import { Button } from "react-bootstrap";

function Forgotpassword({ handleGetList, dataRow }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (data) => {
    try {
      const response = await apiForgotpassword(data);
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
        className="btn btn-primary ml-2"
      >
        Quên mật khẩu
      </Button>
      {open && (
        <FromCustom
          open={open}
          onClose={handleClose}
          handleSubmit={handleSubmit}
          dataRow={dataRow}
          isEdit="Forgotpassword"
        />
      )}
    </>
  );
}

export default Forgotpassword;
