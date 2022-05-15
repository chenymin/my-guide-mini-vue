import { effect } from '../effect';
import { reactive } from '../reactive';

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10
    })

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    })
    expect(nextAge).toBe(11);

    // 更新
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should return runner when call effect", () => {
    // 当调用 runner 的时候可以重新执行 effect.run
    // runner 的返回值就是用户给的 fn 的返回值
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return foo;
    });

    expect(foo).toBe(11);
    runner();
    expect(foo).toBe(12);
    expect(runner()).toBe(13);
  });
})