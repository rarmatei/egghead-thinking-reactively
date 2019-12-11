import React from "react";
import { IonButton } from "@ionic/react";
import BgrCounter from "../../services/BackgroundTasksCounter";

function onClick(text) {
  let time = 0;
  switch (text.toUpperCase()) {
    case "QUICK TASK - 300MS": {
      time = 300;
      break;
    }
    case "ALMOST QUICK TASK - 2200MS": {
      time = 2200;
      break;
    }
    case "START VERY SLOW TASK - 6S": {
      time = 6000;
      break;
    }
    case "START SLOW TASK - 3S": {
      time = 3000;
      break;
    }
    default: {
    }
  }
  setTimeout(() => {
    BgrCounter.taskEnded();
  }, time);
  BgrCounter.taskStarted();
}

export default props => {
  return (
    <IonButton onClick={e => (onClick(props.children), props.onClick(e))}>
      {props.children}
    </IonButton>
  );
};
