import type React from "react";
import { useState } from "react";

export type None = undefined;
export type Option<Value> = None | Value;
export type Sometime<T> = T | Promise<T>;
export type Data = Record<string, unknown>;
export type Effect<A extends Data = Data> = ReturnType<Update<A>>;
export type Update<A extends Data = Data> = <T extends A>(
    set: React.Dispatch<React.SetStateAction<T>>,
) => <E extends any[]>(fn: (...args: E) => Sometime<Option<T>>) => (...e: E) => void;
export type Component = <I extends Data, E extends Data = {}, R extends React.JSX.Element = React.JSX.Element>(
    internal: I,
    fn: (effect: Effect<I>, internal: I, external: E) => R,
) => (external: E) => R;

const update: Update =
    (set) =>
    (fn) =>
    async (...args) => {
        const result = await fn(...args);
        if (result !== undefined) set(result);
    };

export const component: Component = (internal, fn) => (external) => {
    const [_, set] = useState(internal);

    return fn(update(set), _, external);
};
