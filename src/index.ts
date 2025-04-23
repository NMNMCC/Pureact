import type { JSX } from "preact/compat";
import { type Signal, useSignal } from "@preact/signals";

export const none = Symbol("none");
export type None = typeof none;
export type Option<Value> = None | Value;
export type Sometime<T> = T | Promise<T>;
export type Effect<A extends object = object> = ReturnType<Update<A>>;
export type Update<A extends object = object> = (
    set: Signal<A>,
) => <E extends any[]>(
    fn: (...e: E) => Sometime<Option<A>>,
) => (...e: E) => void;
export type Component = <
    A extends object,
    E extends object = {},
    R extends JSX.Element = JSX.Element,
>(
    init: A,
    fn: (args: A & E & { effect: Effect<A> }) => R,
) => (externals: E) => R;

export const update: Update =
    (_) =>
    (fn) =>
    async (...e) => {
        const result = await fn(...e);

        if (result !== none) {
            _.value = result;
        }

        return;
    };

export const component: Component = (init, fn) => (externals) => {
    const _ = useSignal(init);

    return fn({ ..._.value, ...externals, effect: update(_) });
};
