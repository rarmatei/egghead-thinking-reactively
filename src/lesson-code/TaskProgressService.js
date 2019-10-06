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

const loadStarts = new Subject();
const loadEnds = new Subject();

const disableSpinnerCombo = keyboardCombo(["a", "s", "d"]);

const loadUp = loadStarts.pipe(mapTo(1));
const loadDown = loadEnds.pipe(mapTo(-1));

const loadVariations = merge(loadUp, loadDown);

const currentLoadCount = loadVariations.pipe(
  scan((currLoads, loadEvent) => {
    const newCount = currLoads + loadEvent;
    return newCount > 0 ? newCount : 0;
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

const hideDelayed = combineLatest(
  hideSpinner.pipe(first()),
  timer(flashThresholdMs)
);

const loadCounter = currentLoadCount.pipe(
  scan(
    ({ loaded, runningCount }, currCount) => {
      return {
        loaded: currCount < runningCount ? loaded + 1 : loaded,
        runningCount: currCount
      };
    },
    { loaded: 0, runningCount: 0 }
  ),
  map(loadStats => ({
    max: loadStats.loaded + loadStats.runningCount,
    loaded: loadStats.loaded
  }))
);

const spinner = loadCounter.pipe(
  switchMap(stats => displaySpinner(stats.max, stats.loaded))
);

showWithDelay
  .pipe(
    switchMap(() => spinner.pipe(takeUntil(hideDelayed))),
    takeUntil(disableSpinnerCombo)
  )
  .subscribe();

export function taskStarted() {
  loadStarts.next();
}

export function taskCompleted() {
  loadEnds.next();
}

function displaySpinner(total, loaded) {
  return new Observable(() => {
    const loadingSpinnerInstance = initLoadingSpinner(total, loaded);
    loadingSpinnerInstance.then(spinner => spinner.show());
    return () => {
      loadingSpinnerInstance.then(spinner => spinner.hide());
    };
  });
}

export default {
  taskCompleted,
  taskStarted
};
