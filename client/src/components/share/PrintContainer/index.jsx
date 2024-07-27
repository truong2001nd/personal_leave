import { Button } from "@mui/material";
import React, { Fragment, useRef } from "react";
import ReactToPrint, { useReactToPrint } from "react-to-print";

const PrintContainer = ({ titleBtn, children }) => {
  // in phieu
  const componentRef = useRef(null);
  const printButtonRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleOnclickIn = () => {
    printButtonRef && printButtonRef.current && printButtonRef.current.click();
  };

  // in phieu
  return (
    <>
      <div className="d-none w-100">
        <div ref={componentRef}>{children}</div>
      </div>
      <div className="d-none">
        <ReactToPrint
          trigger={() => (
            <button
              className="btn-icon-p-0 print-btn "
              ref={printButtonRef}
              onClick={handlePrint}
            >
              <i className="mdi mdi-printer"></i> In hóa đơn
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
      <Button
        className="ml-2"
        type="button"
        variant="contained"
        color="primary"
        onClick={handleOnclickIn}
      >
        <i className="mdi mdi-printer mr-2" />
        {titleBtn}
        <i className="mdi ml-2" />
      </Button>
    </>
  );
};

export default PrintContainer;
