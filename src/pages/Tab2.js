import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import DisplayCenter from "../components/presentational/DisplayCenter";
import FastExample from "../components/FastExample";

const Tab2 = () => {
  return (
    <IonPage>
      <IonContent>
        <DisplayCenter>
          <FastExample></FastExample>
        </DisplayCenter>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
