import { Observable, merge, Subject, timer, combineLatest } from "rxjs";
import {
  mapTo,
  scan,
  startWith,
  distinctUntilChanged,
  shareReplay,
  filter,
  pairwise,
  switchMap,
  takeUntil
} from "rxjs/operators";
import { initLoadingSpinner } from "../services/LoadingSpinnerService";
import { keyCombo } from "./EventCombo";

const taskStarts = new Subject();
const taskCompletions = new Subject();

const showSpinner = (total, completed) =>
  new Observable(() => {
    const loadingSpinnerPromise = initLoadingSpinner(total, completed);

    loadingSpinnerPromise.then(spinner => {
      spinner.show();
    });

    return () => {
      loadingSpinnerPromise.then(spinner => {
        spinner.hide();
      });
    };
  });

export function newTaskStarted() {
  taskStarts.next();
}

export function existingTaskCompleted() {
  taskCompletions.next();
}

const loadUp = taskStarts.pipe(mapTo(1));
const loadDown = taskCompletions.pipe(mapTo(-1));

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

const loadVariations = merge(loadUp, loadDown);

const currentLoadCount = loadVariations.pipe(
  startWith(0),
  scan((totalCurrentLoads, changeInLoads) => {
    const newLoadCount = totalCurrentLoads + changeInLoads;
    return newLoadCount < 0 ? 0 : newLoadCount;
  }),
  distinctUntilChanged(),
  shareReplay({ bufferSize: 1, refCount: true })
);

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

const loadStats = currentLoadCount.pipe(
  scan(
    (loadStats, loadingUpdate) => {
      const loadsWentDown = loadingUpdate < loadStats.previousLoading;
      const currentCompleted = loadsWentDown
        ? loadStats.completed + 1
        : loadStats.completed;
      return {
        total: currentCompleted + loadingUpdate,
        completed: currentCompleted,
        previousLoading: loadingUpdate
      };
    },
    { total: 0, completed: 0, previousLoading: 0 }
  )
);

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

const spinnerWithStats = loadStats.pipe(
  switchMap(stats => showSpinner(stats.total, stats.completed))
);

const spinnerDeactivated = currentLoadCount.pipe(filter(count => count === 0));

const spinnerActivated = currentLoadCount.pipe(
  pairwise(),
  filter(([prevCount, currCount]) => prevCount === 0 && currCount === 1)
);

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

const flashThreshold = timer(2000);

const shouldShowSpinner = spinnerActivated.pipe(
  switchMap(() => flashThreshold.pipe(takeUntil(spinnerDeactivated)))
);

const shouldHideSpinner = combineLatest(spinnerDeactivated, flashThreshold);

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

const hideSpinnerCombo = keyCombo(["q", "w", "e", "r", "t", "y"]);

shouldShowSpinner
  .pipe(
    switchMap(() => spinnerWithStats.pipe(takeUntil(shouldHideSpinner))),
    takeUntil(hideSpinnerCombo)
  )
  .subscribe();

export default {};
