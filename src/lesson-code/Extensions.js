import {
  existingTaskCompleted,
  newTaskStarted
} from "../lesson-code/TaskProgressService";
import { Observable } from "rxjs";

export function showLoadingStatus() {
  return source => {
    return new Observable(subscriber => {
      newTaskStarted();
      const sourceSubscription = source.subscribe(subscriber);
      return () => {
        sourceSubscription.unsubscribe();
        existingTaskCompleted();
      };
    });
  };
}
