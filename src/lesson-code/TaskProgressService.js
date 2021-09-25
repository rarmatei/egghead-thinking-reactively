import { Observable, merge, Subject, timer, combineLatest } from "rxjs";
import {
  mapTo,
  scan,
  startWith,
  distinctUntilChanged,
  shareReplay,
  pairwise,
  filter,
  switchMap,
  takeUntil, tap, map, withLatestFrom, mergeMapTo
} from "rxjs/operators";
import { initLoadingSpinner } from "../services/LoadingSpinnerService";

const taskStarts = new Subject();
const taskCompletions = new Subject();

const showSpinner = (total, completed) => new Observable(() => {
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

/*
  When does the spinner need to hide?
    When 2 events have happened:
      Spinner became inactive
      2 seconds have passed
*/

const shouldHideSpinner = combineLatest(spinnerDeactivated, flashThreshold);

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

const loadStats = currentLoadCount.pipe(
  tap((...args) => console.log('spinnerWithStats', args)),
  scan(
    (acc, currentLoadCountInScan) => {

      const loadsWentDown = currentLoadCountInScan < acc.prev;
      const currentCompleted = loadsWentDown ? acc.completed + 1 : acc.completed;

      console.log('acc.total', acc.total);
      console.log('acc.completed', acc.completed);

      return {
        total: currentCompleted + currentLoadCountInScan,
        completed: currentCompleted,
        prev: currentLoadCountInScan,
      };

      // acc.total = currentLoadCountInScan > acc.total ? currentLoadCountInScan : acc.total;
      // acc.completed = currentLoadCountInScan > acc.total ? currentLoadCountInScan : acc.total;
    },
    {
      total: 0,
      completed: 0,
      prev: 0,
    }
  ),
  // TODO Via react component
  tap(({ total }) => {
    let el = document.createElement('h1');
    el.id = '123';
    el.style.position = 'absolute';
    el.style.right = 0;
    el.style.bottom = 0;

    if (document.getElementById('123')) {
      el.remove();
      el = document.getElementById('123');
    } else {
      document.body.appendChild(el);
    }

    el.innerText = total;
  })
);

const spinnerWithStats = loadStats.pipe(
  switchMap(({ total, completed }) => showSpinner(total, completed))
);

shouldShowSpinner
  .pipe(
    switchMap(() => spinnerWithStats.pipe(takeUntil(shouldHideSpinner))),
  )
  .subscribe();

export default {};
