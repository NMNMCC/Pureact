import { component, type Option } from "..";

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

const tryFetch = async (): Promise<Data> => {
    const res = await api();

    if ("error" in res) return { data: undefined, error: res.error };

    return { error: undefined, data: res.data };
};

export const Fetcher = component<Data>(
    { data: undefined, error: undefined },
    ({ data, error, effect: $ }) => {
        const loading = !(data && error);
        return (
            <div>
                <button onClick={$(tryFetch)} disabled={loading}>
                    {loading ? "Loading..." : "Fetch Data"}
                </button>
                {error && <p style={{ color: "red" }}>Error: {error}</p>}
                {data && <p>Received: {data}</p>}
            </div>
        );
    },
);
