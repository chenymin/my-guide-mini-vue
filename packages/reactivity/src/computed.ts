import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _getter;
  // 用来控制计算值的缓存，当依赖值发生变化时会执行scheduler将_dirty置为true，保证值变更后获取到新值
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
  // 调用 _effect.run() 触发依赖收集，此时的activityEffects 等价于 this._effect，此时含有scheduler的_effect被收集
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