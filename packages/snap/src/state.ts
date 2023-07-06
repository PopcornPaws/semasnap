export type State = Record<string, string>;

/**
 * Get the current state of the snap. If the snap does not have state, the
 * {@link DEFAULT_STATE} is returned instead.
 *
 * This uses the `snap_manageState` JSON-RPC method to get the state.
 *
 * @returns The current state of the snap.
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#snap_managestate
 */
export async function getState(): Promise<State> {
  const maybeState = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

  const state: State | null = maybeState ?? {} as State;

  // If the snap does not have state, `state` will be `null`. Instead, we return
  // the default state.
  return state
}

/**
 * Set the state of the snap. This will overwrite the current state.
 *
 * This uses the `snap_manageState` JSON-RPC method to set the state. The state
 * is encrypted with the user's secret recovery phrase and stored in the user's
 * browser.
 *
 * @param newState - The new state of the snap.
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#snap_managestate
 */
export async function setState(newState: State) {
  await snap.request({
    method: 'snap_manageState',

    // For this particular example, we use the `ManageStateOperation.UpdateState`
    // enum value, but you can also use the string value `'update'` instead.
    params: { operation: "update", newState },
  });
}

/**
 * Clear the state of the snap. This will set the state to the
 * {@link DEFAULT_STATE}.
 *
 * This uses the `snap_manageState` JSON-RPC method to clear the state.
 *
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#snap_managestate
 */
//export async function clearState() {
//  await snap.request({
//    method: 'snap_manageState',
//
//    // For this particular example, we use the `ManageStateOperation.ClearState`
//    // enum value, but you can also use the string value `'clear'` instead.
//    params: { operation: ManageStateOperation.ClearState },
//  });
//}
