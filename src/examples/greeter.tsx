import { component } from "..";

type Data = {
    count: number;
};

type Externals = {
    name: string;
};

const click = (data: Data) => ({
    ...data,
    count: data.count + 1,
});

export const Greeter = component<Data, Externals>(
    { count: 0 },
    ({ effect: $, ...data }) => {
        return (
            <div>
                <h1>Hello, {data.name}!</h1>
                <p>You clicked the button {data.count} times.</p>
                <button onClick={$(() => click(data))}>Click Me</button>
            </div>
        );
    },
);
