import { component } from "..";

// Internal state
type Data = {
    clickCount: number;
};

// External props passed to the component
type Externals = {
    name: string;
};

export const Greeter = component<Data, Externals>(
    // Initial internal state
    { clickCount: 0 },
    // Component function receiving internal state, external props, and effect function
    ({ clickCount, name, effect: $ }) => {
        // Effect to update internal state
        const handleClick = $(() => ({
            clickCount: clickCount + 1,
        }));

        return (
            <div>
                {/* Use external prop 'name' */}
                <h1>Hello, {name}!</h1>
                {/* Use internal state 'clickCount' */}
                <p>You clicked the button {clickCount} times.</p>
                <button onClick={handleClick}>Click Me</button>
            </div>
        );
    },
);
