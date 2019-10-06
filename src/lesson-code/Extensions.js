import { Observable } from "rxjs";
import LoaderService from "./AsyncTracker";

export function showLoadingStatus() {
  return source => {
    return new Observable(observer => {
      LoaderService.somethingStarted();
      return source.subscribe({
        ...observer,
        next: value => {
          observer.next(value);
          LoaderService.somethingFinished();
        }
      });
    });
  };
}

export class PromiseWithLoadingProgress extends Promise {
  constructor(executor) {
    super((originalResolve, originalReject) => {
      const resolve = (...args) => {
        LoaderService.somethingFinished();
        return originalResolve(...args);
      };
      const reject = (...args) => {
        LoaderService.somethingFinished();
        return originalReject(...args);
      };
      return executor(resolve, reject);
    });
    LoaderService.somethingStarted();
  }
}
