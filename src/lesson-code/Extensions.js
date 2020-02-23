import { Observable } from "rxjs";
import { newTaskStarted, existingTaskCompleted } from "./TaskProgressService";

export function showLoadingStatus() {
  return source => {
    return new Observable(subscriber => {
      newTaskStarted();
      const innerSubscription = source.subscribe({
        next: val => subscriber.next(val),
        error: err => {
          existingTaskCompleted();
          subscriber.error(err);
        },
        complete: () => {
          existingTaskCompleted();
          subscriber.complete();
        }
      });
      return () => {
        existingTaskCompleted();
        innerSubscription.unsubscribe();
      };
    });
  };
}

export class PromiseWithLoadingProgress extends Promise {
  constructor(executor) {
    super((originalResolve, originalReject) => {
      const resolve = (...args) => {
        existingTaskCompleted();
        return originalResolve(...args);
      };
      const reject = (...args) => {
        existingTaskCompleted();
        return originalReject(...args);
      };
      return executor(resolve, reject);
    });
    newTaskStarted();
  }
}
