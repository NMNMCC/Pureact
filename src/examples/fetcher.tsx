import { component, none, type Option } from "..";

type Data = {
    data: Option<string>;
    loading: boolean;
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

export const Fetcher = component<Data>(
    { data: none, loading: false, error: none },
    ({ data, loading, error, effect: $ }) => {
        const fetchData = $(() => {
            // Make request
            api().then((result) => {
                if ("data" in result) {
                    return { data: result.data, loading: false, error: none };
                } else {
                    return { data: none, loading: false, error: result.error };
                }
            });

            // Return loading state immediately
            return { data: none, loading: true, error: none };
        });

        return (
            <div>
                <button onClick={fetchData} disabled={loading}>
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
