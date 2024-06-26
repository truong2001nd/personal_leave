import React, { useState } from "react";
// import { Button } from "@mui/material";
import FromCustom from "./From";
import { toast } from "react-toastify";
import { apiUpdateRoom } from "../../../service/api/room";
import { MdEdit } from "react-icons/md";

function Update({ handleGetList, dataRow }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (data) => {
    try {
      const response = await apiUpdateRoom(data._id, data);
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
      <MdEdit className="mr-2" onClick={handleOpen} />
      {open && (
        <FromCustom
          open={open}
          onClose={handleClose}
          handleSubmit={handleSubmit}
          dataRow={dataRow}
          isEdit={true}
        />
      )}
    </>
  );
}

export default Update;
