import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import DisplayCenter from "../components/DisplayCenter";
import FastExample from "../components/FastExample";

const Tab2 = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Very quick tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <DisplayCenter>
          <FastExample></FastExample>
        </DisplayCenter>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
