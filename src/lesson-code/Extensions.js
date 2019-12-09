import { Observable } from "rxjs";
import TaskProgressService from "./TaskProgressService";

export function showLoadingStatus() {
  return source => {
    return new Observable(observer => {
      TaskProgressService.taskStarted();
      return source.subscribe({
        next: val => observer.next(val),
        error: err => {
          TaskProgressService.taskCompleted();
          observer.error(err);
        },
        complete: () => {
          TaskProgressService.taskCompleted();
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
        TaskProgressService.taskCompleted();
        return originalResolve(...args);
      };
      const reject = (...args) => {
        TaskProgressService.taskCompleted();
        return originalReject(...args);
      };
      return executor(resolve, reject);
    });
    TaskProgressService.taskStarted();
  }
}

const resolveAfter5 = new Promise((resolve, reject) => {
  setTimeout(reject, 5000);
  return "5";
});
