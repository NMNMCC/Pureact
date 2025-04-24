import { component, type Option } from "..";

type Internals = {
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

const tryFetch = async (): Promise<Internals> => {
    const res = await api();

    if ("error" in res) return { data: undefined, error: res.error };

    return { error: undefined, data: res.data };
};

export const Fetcher = component<Internals>({ data: undefined, error: undefined }, ($, internals) => {
    const loading = !(internals.data && internals.error);
    return (
        <div>
            <button onClick={$(tryFetch)} disabled={loading}>
                {loading ? "Loading..." : "Fetch Data"}
            </button>
            {internals.error && <p style={{ color: "red" }}>Error: {internals.error}</p>}
            {internals.data && <p>Received: {internals.data}</p>}
        </div>
    );
});
