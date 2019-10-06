import { Observable } from "rxjs";
import TaskProgressService from "./TaskProgressService";

export function showLoadingStatus() {
  return source => {
    return new Observable(observer => {
      TaskProgressService.taskStarted();
      return source.subscribe({
        ...observer,
        next: value => {
          observer.next(value);
          TaskProgressService.taskCompleted();
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
