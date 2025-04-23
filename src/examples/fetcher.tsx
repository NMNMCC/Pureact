import { component, none, type Option } from "..";

type Data = {
    data: Option<string>;
    error: Option<string>;
};

const api = (): Promise<{ data: string } | { error: string }> =>
    new Promise((resolve) => {
        setTimeout(() => {
            if (Math.random() > 0.7) {
                resolve({ error: "Failed to fetch data!" });
            } else {
                resolve({
                    data: `Data fetched at ${new Date().toLocaleTimeString()}`,
                });
            }
        }, 1500);
    });

const fetchData = async (data: Data): Promise<Data> => {
    const res = await api();

    if ("error" in res) {
        return { ...data, error: res.error };
    }

    return { ...data, data: res.data };
};

export const Fetcher = component<Data>(
    { data: none, error: none },
    ({ data, error, effect: $ }) => {
        const loading = data === none && error === none;
        return (
            <div>
                <button
                    onClick={$(() => fetchData({ data, error }))}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Fetch Data"}
                </button>
                {error !== none && (
                    <p style={{ color: "red" }}>Error: {error}</p>
                )}
                {data !== none && <p>Received: {data}</p>}
            </div>
        );
    },
);
