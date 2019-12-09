import React from "react";
import Button from "./presentational/Button";

const doVeryQuickWork = () => {
  new Promise(resolve => {
    setTimeout(resolve, 300);
  });
};

const doAlmostQuickWork = () => {
  new Promise(resolve => {
    setTimeout(resolve, 2200);
  });
};

const SlowExample = () => {
  return (
    <>
      <Button onClick={doVeryQuickWork}>QUICK task - 300ms</Button>
      <Button onClick={doAlmostQuickWork}>Almost quick task - 2200ms</Button>
    </>
  );
};

export default SlowExample;
