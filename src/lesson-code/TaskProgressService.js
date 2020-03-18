import { Observable, merge } from "rxjs";
import {
  mapTo,
  scan,
  startWith,
  distinctUntilChanged,
  shareReplay
} from "rxjs/operators";

/*
  How do we count?
    Start from zero
    When an async task starts, increase the count by 1
    When a task ends, decrease the count by 1
*/

const taskStarts = new Observable();
const taskCompletions = new Observable();
const showSpinner = new Observable();

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

export default {};
