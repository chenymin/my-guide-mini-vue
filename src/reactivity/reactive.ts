export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);

      // TODO 收集依赖
      return res
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);

      // 触发依赖
      return res;
    }
  });
}