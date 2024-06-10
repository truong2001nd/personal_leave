import React, { useState } from "react";
import FromCustom from "./From";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { apiUpdatePermission } from "../../../service/api/listPermissions";

function Update({ handleGetList, dataRow }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (data) => {
    try {
      const response = await apiUpdatePermission(data._id, data);

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
  dataRow.status = dataRow.status.toString();
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
