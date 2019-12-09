import React from "react";
import { timer } from "rxjs";
import Button from "./presentational/Button";

const slowObservable = timer(6000);
const verySlowObservable = timer(12000);

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
