import React from "react";
import { timer } from "rxjs";
import Button from "./presentational/Button";
import { showLoadingStatus } from "../lesson-code/Extensions";

const slowObservable = timer(3000).pipe(showLoadingStatus());
const verySlowObservable = timer(6000).pipe(showLoadingStatus());

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
