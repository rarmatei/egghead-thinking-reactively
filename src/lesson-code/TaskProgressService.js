import { Observable, Subject, merge, timer, combineLatest } from "rxjs";
import {
  mapTo,
  scan,
  switchMap,
  distinctUntilChanged,
  startWith,
  filter,
  pairwise,
  takeUntil,
  first,
  shareReplay
} from "rxjs/operators";

import { initLoadingSpinner } from "../services/LoadingSpinnerService";
import { keyCombo } from "./EventCombo";

const taskStarts = new Subject();
const taskCompletions = new Subject();

const loadUp = taskStarts.pipe(mapTo(1));
const loadDown = taskCompletions.pipe(mapTo(-1));

const loadVariations = merge(loadUp, loadDown);

const currentLoadCount = loadVariations.pipe(
  scan((totalCurrentLoads, changeInLoads) => {
    const newLoadCount = totalCurrentLoads + changeInLoads;
    return newLoadCount > 0 ? newLoadCount : 0;
  }, 0),
  startWith(0),
  distinctUntilChanged(),
  shareReplay(1)
);

const shouldHideSpinner = currentLoadCount.pipe(filter(count => count === 0));

const shouldShowSpinner = currentLoadCount.pipe(
  pairwise(),
  filter(([prev, curr]) => curr === 1 && prev === 0)
);

const flashThresholdMs = 2000;

const shouldShowWithDelay = shouldShowSpinner.pipe(
  switchMap(() => {
    return timer(flashThresholdMs).pipe(takeUntil(shouldHideSpinner));
  })
);

const shouldHideWithDelay = combineLatest(
  shouldHideSpinner.pipe(first()),
  timer(flashThresholdMs)
);

const loadingStats = currentLoadCount.pipe(
  scan(
    ({ completed, previousLoading }, loadingUpdate) => {
      const loadsWentDown = loadingUpdate < previousLoading;
      const currentCompleted = loadsWentDown ? completed + 1 : completed;
      return {
        completed: currentCompleted,
        previousLoading: loadingUpdate,
        total: currentCompleted + loadingUpdate
      };
    },
    {
      total: 0,
      completed: 0,
      previousLoading: 0
    }
  )
);

const spinner = loadingStats.pipe(
  switchMap(({ total, completed }) => displaySpinner(total, completed))
);

const disableSpinnerCombo = keyCombo(["a", "s", "d"]);

shouldShowWithDelay
  .pipe(
    switchMap(() => spinner.pipe(takeUntil(shouldHideWithDelay))),
    takeUntil(disableSpinnerCombo)
  )
  .subscribe();

function displaySpinner(total, loaded) {
  return new Observable(() => {
    const loadingSpinnerInstance = initLoadingSpinner(total, loaded);
    loadingSpinnerInstance.then(spinner => spinner.show());
    return () => {
      loadingSpinnerInstance.then(spinner => spinner.hide());
    };
  });
}

export function newTaskStarted() {
  taskStarts.next();
}

export function existingTaskCompleted() {
  taskCompletions.next();
}

export default {};
