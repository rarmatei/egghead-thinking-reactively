import React from "react";
import Button from "./presentational/Button";
import {
  newTaskStarted,
  existingTaskCompleted
} from "../lesson-code/TaskProgressService";

const doVeryQuickWork = () => {
  newTaskStarted();
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
      existingTaskCompleted();
    }, 300);
  });
};

const doAlmostQuickWork = () => {
  newTaskStarted();
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
      existingTaskCompleted();
    }, 2200);
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
