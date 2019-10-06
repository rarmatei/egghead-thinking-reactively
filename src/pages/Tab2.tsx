import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import DisplayCenter from "../components/DisplayCenter";

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Very quick tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <DisplayCenter>some content..</DisplayCenter>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
