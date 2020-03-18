import { fromEvent, timer } from "rxjs";
import {
  map,
  filter,
  takeUntil,
  takeWhile,
  skip,
  exhaustMap,
  take
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
        takeUntil(timer(3000)),
        takeWhile((keyPressed, index) => keyCombo[index + 1] === keyPressed),
        skip(keyCombo.length - 2),
        take(1)
      );
    })
  );
}
