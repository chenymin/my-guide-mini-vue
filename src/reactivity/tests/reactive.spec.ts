import { reactive, isReactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observer = reactive(original);
    expect(observer).not.toBe(original);
    expect(observer.foo).toBe(1);
    expect(isReactive(observer)).toBe(true);
  })
})

