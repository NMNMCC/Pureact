import type { Dispatch, JSX } from "preact/compat";
import type { StateUpdater } from "preact/hooks";
import { useState } from "react";

export type None = undefined;
export type Option<Value> = None | Value;
export type Sometime<T> = T | Promise<T>;
export type Data = Record<string, unknown>;
export type Effect<A extends Data = Data> = ReturnType<Update<A>>;
export type Update<A extends Data = Data> = <T extends A>(
    set: Dispatch<StateUpdater<T>>,
) => <E extends any[]>(
    fn: (...args: E) => Sometime<Option<T>>,
) => (...e: E) => void;
export type Component = <
    I extends Data,
    E extends Data = {},
    R extends JSX.Element = JSX.Element,
>(
    internals: I,
    fn: (internals: I & E & { effect: Effect<I> }) => R,
) => (externals: E) => R;

const update: Update =
    (set) =>
    (fn) =>
    async (...args) => {
        const result = await fn(...args);
        if (result !== undefined) set(result);
    };

export const component: Component = (internals, fn) => (externals) => {
    const [_, set] = useState(internals);

    return fn({ ..._, ...externals, effect: update(set) });
};
