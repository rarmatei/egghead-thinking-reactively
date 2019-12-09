import React from "react";
import { timer } from "rxjs";
import { showLoadingStatus } from "../lesson-code/Extensions";
import Button from "./presentational/Button";

const slowObservable = timer(6000).pipe(showLoadingStatus());
const verySlowObservable = timer(12000).pipe(showLoadingStatus());

const doWork = () => {
  slowObservable.subscribe();
};

const doLongWork = () => {
  verySlowObservable.subscribe();
};

const SlowExample = () => {
  return (
    <>
      <Button onClick={doWork}>Start slow task - 6s</Button>
      <Button onClick={doLongWork}>Start very slow task - 12s</Button>
    </>
  );
};

export default SlowExample;
