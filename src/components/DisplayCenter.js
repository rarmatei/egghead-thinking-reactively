import React from "react";

const style = {
  height: "100%",
  display: "flex",
  flexDirection: "column"
};

const DisplayCenter = props => {
  return (
    <div
      style={style}
      className="ion-justify-content-center ion-align-items-center"
    >
      {props.children}
    </div>
  );
};

export default DisplayCenter;
