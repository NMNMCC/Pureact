import { component } from "..";

type Data = {
    todos: string[];
    newTodo: string;
};

const add = (data: Data) => () => {
    if (data.newTodo.trim() === "") return;
    return {
        todos: [...data.todos, data.newTodo],
        newTodo: "",
    };
};

const remove = (data: Data, index: number) => () => ({
    ...data,
    todos: data.todos.filter((_, i) => i !== index),
});

const input = (data: Data, value: string) => ({
    ...data,
    newTodo: value,
});

export const Todo = component<Data>(
    { todos: [], newTodo: "" },
    ({ effect: $, ...data }) => {
        return (
            <div>
                <input
                    type="text"
                    value={data.newTodo}
                    onInput={$((e) => input(data, e.currentTarget.value))}
                />
                <button onClick={$(add(data))}>Add Todo</button>
                <ul>
                    {data.todos.map((todo, index) => (
                        <li key={index}>
                            {todo}
                            <button onClick={$(remove(data, index))}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    },
);
