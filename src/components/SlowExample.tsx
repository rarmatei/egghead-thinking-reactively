import React from "react";
import { IonButton } from "@ionic/react";

const SlowExample: React.FC = () => {
  return (
    <>
      <IonButton>Start slow task</IonButton>
      <IonButton>Start very slow task</IonButton>
    </>
  );
};

export default SlowExample;
