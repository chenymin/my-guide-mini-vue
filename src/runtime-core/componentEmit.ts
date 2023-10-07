import { camelize, toHandlerKey } from "../shared/src/index";

export function emit(instance, event, ...args) {
  console.log('emit', event);
  const { props } = instance;

  // TPP
  // 先去写一个特定行为 -》重构为通用行为

  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}