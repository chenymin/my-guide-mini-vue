import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive';
import { hasChanged, isObject} from '../../shared/src'

class RefImpl {
  private _value:any;
  private dep;
  private _rawValue;
  public __v_isRef = true;

  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    // 收集依赖
    if (isTracking()) {
      trackEffects(this.dep);
    }
    return this._value;
  }
  set value(newValue) {
    // 触发依赖
    if (hasChanged(newValue, this._rawValue)) {
      // 注意设置原始值
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffects(this.dep);    
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export const ref = (value) => {
  const ref = new RefImpl(value);
  return ref;
}

export const isRef = (ref) => {
  return !!ref.__v_isRef
}

export const unRef = (ref) => {
  return ref.__v_isRef ? ref.value : ref;
}
