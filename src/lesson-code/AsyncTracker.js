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
    //ensures it doesn't go below zero
    return newCount > 0 ? newCount : 0;
  }, 0),
  startWith(0),
  distinctUntilChanged(), //in case of multiple zeros,
  shareReplay(1) //show how it doesn't work - then add the share() - then show why we need to change to shareReplay(1)
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

/*
1. the above - initial show and hide, connect the service as an observable
2. requirements come in - it shouldn't flash, it needs the delay when appearing and delay before dissapearing
3. display loading bar as they come, use the max() with repeat() to count loads
4. konami - hide when sequence activated
5. tracker operator and trackable promise
*/

/*
after writing the loadStarts and loadEnds subject:
so I know what we've done doesn't seem like a big deal
but now we are fully in RxJS functional land. At this point, we're done
with all this mental context of services and how it's going to be used
in the Ionic app. We can now focus and work with just these two observables:
one that tells us when a load started, and another one that tells us
when it ended.

Try to see if I can work backwards - build the larger observable
as pseudo code and work backwards

say that we can make it to accept observables - but that would
introduce a range of things we have to cater for - for example, we want this
to be a passive service, that doesn't generate any other work besides
showing the bar at the bottom - so because of that we'd only be able to send
in hot observables, as cold ones generate new subscriptions
or what if we want to use promises?
we want to keep it as simple as possible, we'll use an up and down method for now
we'll then build further abstractions on top of it
*/

export default {
  taskCompleted,
  taskStarted
};
