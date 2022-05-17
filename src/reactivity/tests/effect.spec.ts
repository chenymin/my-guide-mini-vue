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

  it("scheduler", () => {
    // 1.通过 effect 的第二个参数给定一个 scheduler 的fn
    // 2.effect 第一次执行的时候，还会执行fn
    // 3.当响应式对象 set update 不会执行fn 而是执行 scheduler
    // 4.如果说当执行 runner 的时候，会再次的执行 fn 
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(2);
  });
})