import React from "react";
import { timer } from "rxjs";
import Button from "./presentational/Button";
import {} from "../lesson-code/TaskProgressService";

const slowObservable = timer(3000);
const verySlowObservable = timer(6000);

const doWork = () => {
  slowObservable.subscribe();
};

const doLongWork = () => {
  verySlowObservable.subscribe();
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
