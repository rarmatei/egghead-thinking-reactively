import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import React from "react";
import DisplayCenter from "../components/DisplayCenter";
import SlowExample from "../components/SlowExample";

const Tab1 = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Solve problems reactively</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <DisplayCenter>
          <SlowExample></SlowExample>
        </DisplayCenter>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
