import React from "react";
import { IonButton } from "@ionic/react";
import { timer } from "rxjs";
import {
  showLoadingStatus,
  PromiseWithLoadingProgress
} from "../lesson-code/Extensions";

const slowObservable = timer(6000).pipe(showLoadingStatus());
const verySlowObservable = timer(12000).pipe(showLoadingStatus());

const doWork = () => {
  slowObservable.subscribe();
};

const doLongWork = () => {
  verySlowObservable.subscribe();
};
const doPromiseWork = () => {
  new PromiseWithLoadingProgress(resolve => {
    setTimeout(resolve, 4000);
  });
};

const SlowExample = () => {
  return (
    <>
      <IonButton onClick={doWork}>Start slow task</IonButton>
      <IonButton onClick={doLongWork}>Start very slow task</IonButton>
    </>
  );
};

export default SlowExample;
