import { component } from "..";

type Internals = {
    count: number;
};

const decrement = (data: Internals) => (): Internals => ({
    count: data.count - 1,
});
const increment = (data: Internals) => (): Internals => ({
    count: data.count + 1,
});

export const Counter = component<Internals>({ count: 0 }, ($, internals) => {
    return (
        <>
            <button onClick={$(decrement(internals))}>-1</button>
            <p> {internals.count} </p>
            <button onClick={$(increment(internals))}>+1</button>
        </>
    );
});
