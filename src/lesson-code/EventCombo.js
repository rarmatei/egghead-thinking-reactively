import { fromEvent, of, timer, concat } from "rxjs";
import {
  map,
  filter,
  takeWhile,
  take,
  takeUntil,
  exhaustMap,
  startWith
} from "rxjs/operators";

const anyKeyPresses = fromEvent(document, "keypress").pipe(
  map(event => event.key)
);

function keyPressed(key) {
  return anyKeyPresses.pipe(filter(pressedKey => pressedKey === key));
}

export function keyCombo(keyCombo) {
  const comboInitiator = keyCombo[0];
  return keyPressed(comboInitiator).pipe(
    exhaustMap(key => {
      return anyKeyPresses.pipe(
        startWith(key),
        takeWhile((key, index) => keyCombo[index] === key),
        filter((_, index) => index === keyCombo.length - 1),
        take(1),
        takeUntil(timer(5000))
      );
    })
  );
}
