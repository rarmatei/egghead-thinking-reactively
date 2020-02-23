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
      const innerComboSize = keyCombo.length - 1;
      return anyKeyPresses.pipe(
        takeWhile((keyPressed, index) => keyCombo[index + 1] === keyPressed),
        skip(innerComboSize - 1),
        take(1),
        takeUntil(timer(5000))
      );
    })
  );
}
