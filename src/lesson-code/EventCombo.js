import { fromEvent, of, timer, concat } from "rxjs";
import {
  map,
  filter,
  takeWhile,
  take,
  takeUntil,
  exhaustMap
} from "rxjs/operators";

const keyPresses = fromEvent(document, "keypress").pipe(
  map(event => event.key)
);

export function keyboardCombo(keyCombo) {
  return keyPresses.pipe(
    exhaustMap(key => {
      return concat(of(key), keyPresses).pipe(
        takeWhile((key, index) => keyCombo[index] === key),
        filter((_, index) => index === keyCombo.length - 1),
        take(1),
        takeUntil(timer(5000))
      );
    })
  );
}
