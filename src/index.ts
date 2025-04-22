import { render, VNode } from "preact";

// Core Types

/**
 * Represents the description of a side effect to be performed.
 * This is a data structure, interpreted by the effect handler.
 * @template E User-defined union type for all possible effect descriptions.
 */
export type Effect<E> = E;

/**
 * Represents the application's state.
 * Must be treated as immutable.
 * @template S User-defined type for the application state structure.
 */
export type State<S> = S;

/**
 * Represents an action, describing an intent to change the state.
 * Typically a discriminated union of plain objects.
 * @template A User-defined union type for all possible actions.
 */
export type Action<A> = A;

/**
 * A function to dispatch actions to the runtime.
 * @template A User-defined union type for all possible actions.
 */
export type Dispatch<A> = (action: Action<A>) => void;

/**
 * A pure function that defines how the state should change in response to an action.
 * It must return the new state and any effects to be executed.
 * @template S User-defined state type.
 * @template A User-defined action type.
 * @template E User-defined effect type.
 * @param action The action that occurred.
 * @param state The current state.
 * @returns A tuple containing the new state and an effect description (or a conventional 'none' value).
 */
export type Update<S, A, E> = (
    action: Action<A>,
    state: State<S>,
) => [State<S>, Effect<E>];

/**
 * A pure function that renders a part of the UI based on props and state.
 * It receives necessary data and a dispatch function to trigger actions.
 * @template P Props type for the view.
 * @template S The application state type (or relevant fragment).
 * @template A User-defined action type.
 * @param props The properties passed to this view.
 * @param state The current state (or relevant fragment).
 * @param dispatch Function to dispatch actions.
 * @returns A Preact VNode representing the UI.
 */
export type View<P, S, A> = (
    props: P,
    state: State<S>,
    dispatch: Dispatch<A>,
) => VNode<any>;

/**
 * Handles the execution of side effects described by Effect data structures.
 * This is an impure function, interacting with the outside world.
 * It receives the effect description and a dispatch function to send actions back
 * into the system (e.g., on effect completion or error).
 * @template A User-defined action type.
 * @template E User-defined effect type.
 * @param effect The effect description to execute.
 * @param dispatch Function to dispatch actions resulting from the effect.
 * @returns A Promise that resolves when the effect handling is initiated or completed (depending on implementation).
 */
export type EffectHandler<A, E> = (
    effect: Effect<E>,
    dispatch: Dispatch<A>,
) => Promise<void>;

/**
 * Represents a subscription to an external event source (e.g., timers, WebSockets, browser events).
 * It's a function that sets up the subscription based on the current state and returns a cleanup function.
 * @template S User-defined state type.
 * @template A User-defined action type.
 * @param state The current state, allowing subscriptions to be conditional.
 * @param dispatch Function to dispatch actions when the external source emits events.
 * @returns A cleanup function to be called when the subscription is no longer needed (e.g., state changes or app unmounts), or void if no cleanup is necessary.
 */
export type Subscription<S, A> = (
    state: State<S>,
    dispatch: Dispatch<A>,
) => (() => void) | void;

/**
 * Configuration object for initializing and running a Pureact application.
 * @template S User-defined state type.
 * @template A User-defined action type.
 * @template E User-defined effect type.
 * @template P Props type for the root view.
 */
export interface AppConfig<S, A, E, P> {
    /** Function returning the initial state and any initial effects. */
    init: () => [State<S>, Effect<E>];
    /** The root view function. */
    view: View<P, S, A>;
    /** The state update function. */
    update: Update<S, A, E>;
    /** The handler for executing effects. */
    effect_handler: EffectHandler<A, E>;
    /** An array of subscription functions. */
    subscriptions: Subscription<S, A>[];
    /** Props to be passed to the root view. */
    root_props: P;
    /** A conventional effect value representing 'no effect'. */
    no_effect: E;
}

/**
 * Initializes and runs the Pureact application, mounting it to the specified DOM container.
 * Manages the state, action dispatching, effect execution, subscriptions, and rendering loop.
 *
 * @template S User-defined state type.
 * @template A User-defined action type.
 * @template E User-defined effect type.
 * @template P Props type for the root view.
 * @param container The DOM element to mount the application into.
 * @param config The application configuration object.
 */
export function runPureact<S, A, E, P>(
    container: Element,
    config: AppConfig<S, A, E, P>,
): void {
    let current_state: State<S>;
    let active_subscription_cleanups: (() => void)[] = [];
    let action_queue: Action<A>[] = [];
    let effect_queue: Effect<E>[] = [];
    let rendering_scheduled = false;
    let is_processing = false; // Prevent re-entrant processing

    const {
        init,
        view,
        update,
        effect_handler,
        subscriptions,
        root_props,
        no_effect,
    } = config;

    // --- Dispatch Function ---
    const dispatch: Dispatch<A> = (action: Action<A>): void => {
        action_queue.push(action);
        schedule_processing();
    };

    // --- Processing Scheduler ---
    function schedule_processing(): void {
        if (!rendering_scheduled) {
            rendering_scheduled = true;
            Promise.resolve().then(process_queues);
        }
    }

    // --- Core Processing Loop ---
    function process_queues(): void {
        if (is_processing) return; // Avoid re-entrancy, rely on scheduling
        is_processing = true;
        rendering_scheduled = false;

        let state_changed = false;

        // Process all queued actions
        if (action_queue.length > 0) {
            const actions_to_process = action_queue;
            action_queue = []; // Clear queue before processing

            actions_to_process.forEach((action) => {
                const [new_state, effect] = update(action, current_state);
                // Simple reference check for change detection
                if (new_state !== current_state) {
                    current_state = new_state;
                    state_changed = true;
                }
                if (effect !== no_effect) {
                    effect_queue.push(effect);
                }
            });
        }

        // Process all queued effects
        if (effect_queue.length > 0) {
            const effects_to_process = effect_queue;
            effect_queue = []; // Clear queue before processing

            effects_to_process.forEach((effect) => {
                effect_handler(effect, dispatch).catch((error) => {
                    console.error("Error handling effect:", effect, error);
                    // Optionally dispatch an error action here:
                    // if (config.error_action) dispatch(config.error_action(error, effect));
                });
            });
        }

        // If state changed, re-evaluate subscriptions and render
        if (state_changed) {
            // Teardown old subscriptions
            active_subscription_cleanups.forEach((cleanup) => {
                try {
                    cleanup();
                } catch (error) {
                    console.error("Error cleaning up subscription:", error);
                }
            });
            active_subscription_cleanups = [];

            // Setup new subscriptions based on current state
            subscriptions.forEach((sub_factory) => {
                try {
                    const cleanup = sub_factory(current_state, dispatch);
                    if (typeof cleanup === "function") {
                        active_subscription_cleanups.push(cleanup);
                    }
                } catch (error) {
                    console.error("Error setting up subscription:", error);
                }
            });

            // Render the view with the new state
            try {
                render(view(root_props, current_state, dispatch), container);
            } catch (error) {
                console.error("Error rendering view:", error);
                // Handle render errors, maybe render an error boundary?
            }
        }

        is_processing = false;

        // If new actions were dispatched during effect handling or rendering (unlikely but possible),
        // schedule another processing cycle.
        if (action_queue.length > 0) {
            schedule_processing();
        }
    }

    // --- Initialization ---
    try {
        const [initial_state, initial_effect] = init();
        current_state = initial_state;

        if (initial_effect !== no_effect) {
            effect_queue.push(initial_effect);
        }

        // Initial render and subscription setup is triggered by the first processing call
        schedule_processing();
    } catch (error) {
        console.error("Error during application initialization:", error);
        // Render an error message or throw?
        container.textContent =
            "Application initialization failed. Check console for details.";
    }
}

// Export core types and the run function
// export { VNode, h }; // Re-export Preact essentials for convenience
