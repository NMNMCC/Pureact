import type React from "react";
import { component, type Option } from "..";

type Internal = {
    todos: string[];
    newTodo: string;
};

const add = (data: Internal) => (): Option<Internal> => {
    if (data.newTodo.trim() === "") return;
    return {
        todos: [...data.todos, data.newTodo],
        newTodo: "",
    };
};

const remove = (data: Internal, index: number) => (): Internal => ({
    ...data,
    todos: data.todos.filter((_, i) => i !== index),
});

const input =
    (data: Internal) =>
    (e: React.FormEvent<HTMLInputElement>): Internal => ({
        ...data,
        newTodo: e.currentTarget.value,
    });

export const Todo = component<Internal>({ todos: [], newTodo: "" }, ($, internal) => {
    return (
        <div>
            <input type="text" value={internal.newTodo} onInput={$(input(internal))} />
            <button onClick={$(add(internal))}>Add Todo</button>
            <ul>
                {internal.todos.map((todo, index) => (
                    <li key={index}>
                        {todo}
                        <button onClick={$(remove(internal, index))}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
});
