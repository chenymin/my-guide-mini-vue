import { track, trigger } from './effect';
import { ReactiveFlags, reactive, readonly } from "./reactive";
import { isObject, extend } from "../../shared/src";

const get = createGetter();
const set = createSetter();

const readonlyGet = createGetter(true);

const shallowGet = createGetter(true, true)

function createGetter(isReadOnly = false, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadOnly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadOnly
    }
    const res = Reflect.get(target, key);
    if (shallow) {
      return res
    }

    if (isObject(res)) {
      return isReadOnly ? readonly(res) : reactive(res);
    }
    if (!isReadOnly) {
      // 收集依赖
      track(target, key);
    }
    return res
  }
}

function createSetter(){
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);

    // 触发依赖
    trigger(target, key);
    return res;
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key:${key} set 失败 因为是只读的`);
    return true;
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowGet,
});