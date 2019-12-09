import { Observable } from "rxjs";
import { taskStarted, taskCompleted } from "./TaskProgressService";

export function showLoadingStatus() {
  return source => {
    return new Observable(observer => {
      taskStarted();
      return source.subscribe({
        next: val => observer.next(val),
        error: err => {
          taskCompleted();
          observer.error(err);
        },
        complete: () => {
          taskCompleted();
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
        taskCompleted();
        return originalResolve(...args);
      };
      const reject = (...args) => {
        taskCompleted();
        return originalReject(...args);
      };
      return executor(resolve, reject);
    });
    taskStarted();
  }
}
