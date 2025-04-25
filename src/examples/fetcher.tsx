import { component, type Option } from "..";

type Internal = {
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

const tryFetch = async (): Promise<Internal> => {
    const res = await api();

    if ("error" in res) return { data: undefined, error: res.error };

    return { error: undefined, data: res.data };
};

export const Fetcher = component<Internal>({ data: undefined, error: undefined }, ($, internal) => {
    const loading = !(internal.data && internal.error);
    return (
        <div>
            <button onClick={$(tryFetch)} disabled={loading}>
                {loading ? "Loading..." : "Fetch Data"}
            </button>
            {internal.error && <p style={{ color: "red" }}>Error: {internal.error}</p>}
            {internal.data && <p>Received: {internal.data}</p>}
        </div>
    );
});
