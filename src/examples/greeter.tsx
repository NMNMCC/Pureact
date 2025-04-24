import { component } from "..";

type Internals = {
    count: number;
};

type Externals = {
    name: string;
};

const click = (data: Internals) => (): Internals => ({
    count: data.count + 1,
});

export const Greeter = component<Internals, Externals>({ count: 0 }, ($, internals, { name }) => {
    return (
        <div>
            <h1>Hello, {name}!</h1>
            <p>You clicked the button {internals.count} times.</p>
            <button onClick={$(click(internals))}>Click Me</button>
        </div>
    );
});
