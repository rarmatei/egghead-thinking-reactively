import { Observable } from "rxjs";
import { newTaskStarted, existingTaskCompleted } from "./TaskProgressService";

export function showLoadingStatus() {
  return source => {
    return new Observable(observer => {
      newTaskStarted();
      return source.subscribe({
        next: val => observer.next(val),
        error: err => {
          existingTaskCompleted();
          observer.error(err);
        },
        complete: () => {
          existingTaskCompleted();
          observer.complete();
        }
      });
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
