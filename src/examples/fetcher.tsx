import { component, none, type Option } from "..";

type Data = {
    data: Option<string>;
    loading: boolean;
    error: Option<string>;
};

// Simulate API call
const apiFetch = (): Promise<{ data: string } | { error: string }> =>
    new Promise((resolve) => {
        setTimeout(() => {
            // Simulate potential error
            if (Math.random() > 0.7) {
                resolve({ error: "Failed to fetch data!" });
            } else {
                resolve({
                    data: `Data fetched at ${new Date().toLocaleTimeString()}`,
                });
            }
        }, 1500); // Simulate network delay
    });

export const Fetcher = component<Data>(
    // Initial state
    { data: none, loading: false, error: none },
    // Component function
    ({ data, loading, error, effect: $ }) => {
        // Effect handler for processing the fetch result
        // This function is intended to be called by the promise resolution,
        // so it needs to be created by `$` to update the state.
        const handleFetchResult = $(
            (result: { data: string } | { error: string }): Option<Data> => {
                if ("data" in result) {
                    // Update state on success
                    return { data: result.data, loading: false, error: none };
                } else {
                    // Update state on error
                    return { data: none, loading: false, error: result.error };
                }
            },
        );

        // Effect handler for initiating the fetch, attached to the button's onClick
        const startFetch = $((): Option<Data> => {
            // Trigger the async fetch but don't await it here.
            apiFetch()
                .then((res) => {
                    // IMPORTANT: Call the effect function created by `$`, not the raw handler function.
                    // This ensures the state update mechanism is triggered correctly.
                    handleFetchResult(res);
                })
                .catch((err) => {
                    // In a real app, handle promise rejection more robustly.
                    console.error("Error during fetch process:", err);
                    // Update state to show a generic fetch error using the effect handler.
                    handleFetchResult({
                        error: "An unexpected error occurred during fetch.",
                    });
                });

            // Return the intermediate loading state synchronously.
            // This update happens immediately when the button is clicked.
            return { data: none, loading: true, error: none };
        });

        // Render UI
        return (
            <div>
                <button onClick={startFetch} disabled={loading}>
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
