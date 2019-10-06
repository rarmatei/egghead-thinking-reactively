import React from "react";
import { IonButton } from "@ionic/react";
import { timer } from "rxjs";
import { showLoadingStatus } from "../lesson-code/Extensions";

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
      <IonButton onClick={doWork}>Start slow task - 6s</IonButton>
      <IonButton onClick={doLongWork}>Start very slow task - 12s</IonButton>
    </>
  );
};

export default SlowExample;
