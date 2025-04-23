import { component } from "..";

type Data = {
    count: number;
};

export const Counter = component<Data>({ count: 0 }, ({ count, effect: $ }) => {
    return (
        <>
            <button onClick={$(() => ({ count: count - 1 }))}>-1</button>
            <p> {count} </p>
            <button onClick={$(() => ({ count: count + 1 }))}>+1</button>
        </>
    );
});
