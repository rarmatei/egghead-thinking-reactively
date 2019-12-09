import { Observable, Subject, merge, timer, combineLatest } from "rxjs";
import {
  mapTo,
  scan,
  map,
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
import { keyboardCombo } from "./EventCombo";

const loadingStarted = new Subject();
const loadingCompleted = new Subject();

const loadUp = loadingStarted.pipe(mapTo(1));
const loadDown = loadingCompleted.pipe(mapTo(-1));

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

const hideSpinner = currentLoadCount.pipe(filter(count => count === 0));

const showSpinner = currentLoadCount.pipe(
  pairwise(),
  filter(([prev, curr]) => curr === 1 && prev === 0)
);

const flashThresholdMs = 2000;

const showWithDelay = showSpinner.pipe(
  switchMap(() => {
    return timer(flashThresholdMs).pipe(takeUntil(hideSpinner));
  })
);

const hideWithDelay = combineLatest(
  hideSpinner.pipe(first()),
  timer(flashThresholdMs)
);

const loadCounter = currentLoadCount.pipe(
  scan(
    ({ loaded, currentlyInProgress }, runningCount) => {
      return {
        loaded: runningCount < currentlyInProgress ? loaded + 1 : loaded,
        currentlyInProgress: runningCount
      };
    },
    { loaded: 0, runningCount: 0 }
  ),
  map(loadStats => ({
    max: loadStats.loaded + loadStats.currentlyInProgress,
    loaded: loadStats.loaded
  }))
);

const spinner = loadCounter.pipe(
  switchMap(stats => displaySpinner(stats.max, stats.loaded))
);

const disableSpinnerCombo = keyboardCombo(["a", "s", "d"]);

showWithDelay
  .pipe(
    switchMap(() => spinner.pipe(takeUntil(hideWithDelay))),
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

export function taskStarted() {
  loadingStarted.next();
}

export function taskCompleted() {
  loadingCompleted.next();
}
