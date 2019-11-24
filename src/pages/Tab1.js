import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import DisplayCenter from "../components/presentational/DisplayCenter";
import SlowExample from "../components/SlowExample";

const Tab1 = () => {
  return (
    <IonPage>
      <IonContent>
        <DisplayCenter>
          <SlowExample></SlowExample>
        </DisplayCenter>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
