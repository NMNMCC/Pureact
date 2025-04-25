import { component } from "..";

type Internal = {
    count: number;
};

const decrement = (data: Internal) => (): Internal => ({
    count: data.count - 1,
});
const increment = (data: Internal) => (): Internal => ({
    count: data.count + 1,
});

export const Counter = component<Internal>({ count: 0 }, ($, internal) => {
    return (
        <>
            <button onClick={$(decrement(internal))}>-1</button>
            <p> {internal.count} </p>
            <button onClick={$(increment(internal))}>+1</button>
        </>
    );
});
