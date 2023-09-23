import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _getter;
  // 用来控制计算值的缓存，当依赖值发生变化时将_dirty置为true，保证值变更后获取到新值
  // 主要是利用
  private _dirty = true;
  private _value;
  private _effect;
  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }
  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
      return this._value
    }
    return this._value;
  }
}

export const computed = (getter) => {
  return new ComputedRefImpl(getter);
}