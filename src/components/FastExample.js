import React from "react";
import { IonButton } from "@ionic/react";
import { PromiseWithLoadingProgress } from "../lesson-code/Extensions";

const doVeryQuickWork = () => {
  new PromiseWithLoadingProgress(resolve => {
    setTimeout(resolve, 300);
  });
};

const doAlmostQuickWork = () => {
  new PromiseWithLoadingProgress(resolve => {
    setTimeout(resolve, 2200);
  });
};

const SlowExample = () => {
  return (
    <>
      <IonButton onClick={doVeryQuickWork}>QUICK task - 300ms</IonButton>
      <IonButton onClick={doAlmostQuickWork}>
        Almost quick task - 2200ms
      </IonButton>
    </>
  );
};

export default SlowExample;
