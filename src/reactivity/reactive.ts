import { mutableHandlers, readonlyHandlers } from './baseHandler';


export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

function createReactiveObject(raw, baseHandler) {
  return new Proxy(raw, baseHandler);
}