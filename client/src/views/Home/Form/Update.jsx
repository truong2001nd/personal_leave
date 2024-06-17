import React, { useState } from "react";
import FromCustom from "./From";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { apiUpdateApproval } from "../../../service/api/single";

function Update({ handleGetList, dataRow }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClik = () => {
    dataRow.status === 0
      ? handleOpen()
      : dataRow.status === 1
      ? toast.error("Đơn đã được chấp thuận")
      : toast.error("Đơn đã bị từ chối chấp thuận");
  };
  const handleSubmit = async (data) => {
    try {
      const response = await apiUpdateApproval(data._id, data);
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
      <MdEdit className="mr-2" onClick={handleClik} />
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
