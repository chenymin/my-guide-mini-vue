class ReactiveEffect {
  private _fn: any;

  constructor(fn1) {
    this._fn = fn1;
  }
  run() {
    this._fn();
  }
}


export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}