import { component } from "..";

type Internal = {
    count: number;
};

type External = {
    name: string;
};

const click = (data: Internal) => (): Internal => ({
    count: data.count + 1,
});

export const Greeter = component<Internal, External>({ count: 0 }, ($, internal, { name }) => {
    return (
        <div>
            <h1>Hello, {name}!</h1>
            <p>You clicked the button {internal.count} times.</p>
            <button onClick={$(click(internal))}>Click Me</button>
        </div>
    );
});
