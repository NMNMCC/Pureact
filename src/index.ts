import type { JSX } from "preact/compat";
import type { Signal } from "@preact/signals";

const { useSignal } = await (async () => {
    try {
        return await import("@preact/signals");
    } catch (e) {
        return await import("@preact/signals-react");
    }
})();

export const none = Symbol("none");
export type None = typeof none;
export type Option<Value> = None | Value;
export type Sometime<T> = T | Promise<T>;
export type Effect<A extends object = object> = ReturnType<Update<A>>;
export type Update<A extends object = object> = (
    set: Signal<A>,
) => <E extends any[]>(
    fn: (...args: E) => Sometime<Option<A>>,
) => (...e: E) => void;
export type Component = <
    I extends object,
    E extends object = {},
    R extends JSX.Element = JSX.Element,
>(
    internals: I,
    fn: (internals: I & E & { effect: Effect<I> }) => R,
) => (externals: E) => R;

const update: Update =
    (_) =>
    (fn) =>
    async (...args) => {
        const result = await fn(...args);

        if (result !== none) {
            _.value = result;
        }

        return;
    };

export const component: Component = (internals, fn) => (externals) => {
    const _ = useSignal(internals);

    return fn({ ..._.value, ...externals, effect: update(_) });
};
