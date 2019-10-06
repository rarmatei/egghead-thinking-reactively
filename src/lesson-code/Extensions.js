import { Observable } from "rxjs";
import LoaderService from "./AsyncTracker";

export function showLoadingStatus() {
  return source => {
    return new Observable(observer => {
      LoaderService.taskStarted();
      return source.subscribe({
        ...observer,
        next: value => {
          observer.next(value);
          LoaderService.taskCompleted();
        }
      });
    });
  };
}

export class PromiseWithLoadingProgress extends Promise {
  constructor(executor) {
    super((originalResolve, originalReject) => {
      const resolve = (...args) => {
        LoaderService.taskCompleted();
        return originalResolve(...args);
      };
      const reject = (...args) => {
        LoaderService.taskCompleted();
        return originalReject(...args);
      };
      return executor(resolve, reject);
    });
    LoaderService.taskStarted();
  }
}
