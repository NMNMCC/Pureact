import type React from "react";
import { component, type Option } from "..";

type Internals = {
    todos: string[];
    newTodo: string;
};

const add = (data: Internals) => (): Option<Internals> => {
    if (data.newTodo.trim() === "") return;
    return {
        todos: [...data.todos, data.newTodo],
        newTodo: "",
    };
};

const remove = (data: Internals, index: number) => (): Internals => ({
    ...data,
    todos: data.todos.filter((_, i) => i !== index),
});

const input =
    (data: Internals) =>
    (e: React.FormEvent<HTMLInputElement>): Internals => ({
        ...data,
        newTodo: e.currentTarget.value,
    });

export const Todo = component<Internals>({ todos: [], newTodo: "" }, ($, internals) => {
    return (
        <div>
            <input type="text" value={internals.newTodo} onInput={$(input(internals))} />
            <button onClick={$(add(internals))}>Add Todo</button>
            <ul>
                {internals.todos.map((todo, index) => (
                    <li key={index}>
                        {todo}
                        <button onClick={$(remove(internals, index))}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
});
