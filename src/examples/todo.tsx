import { component, none } from "..";
import type { JSX } from "preact/compat";

type Data = {
    todos: string[];
    newTodo: string;
};

export const Todo = component<Data, {}, JSX.Element>(
    { todos: [], newTodo: "" },
    ({ todos, newTodo, effect: $ }) => {
        const input = $((e: JSX.TargetedEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement | null;
            if (target) {
                return { todos, newTodo: target.value };
            }
            return none;
        });

        const add = $(() => {
            if (newTodo.trim() === "") return none;
            return { todos: [...todos, newTodo], newTodo: "" };
        });

        const remove = $((index: number) => ({
            todos: todos.filter((_, i) => i !== index),
            newTodo,
        }));

        return (
            <div>
                <input type="text" value={newTodo} onInput={input} />
                <button onClick={add}>Add Todo</button>
                <ul>
                    {todos.map((todo, index) => (
                        <li key={index}>
                            {todo}
                            <button
                                onClick={() => remove(index)}
                                style={{ marginLeft: "8px" }}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    },
);
