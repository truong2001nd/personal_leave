import React, { useState } from "react";
import FromCustom from "./From";
import { toast } from "react-toastify";
import { apiUpdateApproval } from "../../../service/api/single";

function Update({ handleGetList, dataRow }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      <div onClick={handleOpen}>
        {dataRow?.name} - lí do:
        {dataRow?.content &&
          JSON.parse(dataRow?.content).find(
            (content) => content.key === "reason"
          )?.value}
      </div>
      {open && (
        <FromCustom
          open={open}
          onClose={handleClose}
          handleSubmit={handleSubmit}
          dataRow={dataRow}
          isEdit={false}
        />
      )}
    </>
  );
}

export default Update;
