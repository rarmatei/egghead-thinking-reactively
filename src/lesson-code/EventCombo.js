import { fromEvent, timer } from "rxjs";
import {
  map,
  filter,
  takeWhile,
  take,
  takeUntil,
  exhaustMap,
  skip
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
    exhaustMap(() => {
      return anyKeyPresses.pipe(
        takeWhile((key, index) => keyCombo[index + 1] === key),
        skip(keyCombo.length - 2),
        take(1),
        takeUntil(timer(5000))
      );
    })
  );
}
