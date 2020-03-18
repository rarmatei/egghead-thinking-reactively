import React from "react";
import { timer } from "rxjs";
import Button from "./presentational/Button";
import {
  existingTaskCompleted,
  newTaskStarted
} from "../lesson-code/TaskProgressService";

const slowObservable = timer(3000);
const verySlowObservable = timer(6000);

const doWork = () => {
  newTaskStarted();
  slowObservable.subscribe(() => {
    existingTaskCompleted();
  });
};

const doLongWork = () => {
  newTaskStarted();
  verySlowObservable.subscribe(() => {
    existingTaskCompleted();
  });
};

const SlowExample = () => {
  return (
    <>
      <Button onClick={doWork}>Start slow task - 3s</Button>
      <Button onClick={doLongWork}>Start very slow task - 6s</Button>
    </>
  );
};

export default SlowExample;
