import { component } from "..";

type Data = {
    todos: string[];
    newTodo: string;
};

const add = (data: Data) => {
    if (data.newTodo.trim() === "") return data;
    return {
        todos: [...data.todos, data.newTodo],
        newTodo: "",
    };
};

const remove = (data: Data, index: number) => ({
    ...data,
    todos: data.todos.filter((_, i) => i !== index),
});

const input = (data: Data, value: string) => ({
    ...data,
    newTodo: value,
});

export const Todo = component<Data>(
    { todos: [], newTodo: "" },
    ({ todos, newTodo, effect: $ }) => {
        return (
            <div>
                <input
                    type="text"
                    value={newTodo}
                    onInput={$((e) =>
                        input({ todos, newTodo }, e.currentTarget.value),
                    )}
                />
                <button onClick={$(() => add({ todos, newTodo }))}>
                    Add Todo
                </button>
                <ul>
                    {todos.map((todo, index) => (
                        <li key={index}>
                            {todo}
                            <button
                                onClick={$(() =>
                                    remove({ todos, newTodo }, index),
                                )}
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
