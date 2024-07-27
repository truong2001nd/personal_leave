import React, { useState } from "react";
import FromCustom from "./From";
import { toast } from "react-toastify";
import { apiDeleteSingle } from "../../../service/api/single";
import { FaTrashCanArrowUp } from "react-icons/fa6";

function Delete({ handleGetlistSingle, dataRow }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (data) => {
    try {
      const response = await apiDeleteSingle(data._id);
      if (response.data.status === 200) {
        toast.success(response.data.message);
        handleGetlistSingle();
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
      <FaTrashCanArrowUp className="mr-2" onClick={handleOpen} />
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

export default Delete;
