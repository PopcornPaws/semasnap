import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { bytesToHex } from '@metamask/utils';
import { Identity } from "@semaphore-protocol/identity";

import { getEntropy } from "./entropy";
import { getState, setState, State } from "./state";

type RegisterIdentityParams = {
    name: string | null,
    salt: string | null,
};

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ snapId, request }) => {
  switch (request.method) {
    case "registerIdentity": {
        const params = request.params as RegisterIdentityParams;

        // generate new identity from the snap's entropy
        let idName;
        if (!params.name) {
            idName = "default";
        } else {
            idName = params.name;
        };

        const entropy = await getEntropy(params.salt);
        const identity = new Identity(entropy);

        // load currently stored state
        let state = await getState();

        // add (name - identity) pair to the identity map
        state[idName] = identity.toString();

        // store updated state
        await setState(state);

        return `0x${identity.commitment.toString(16)}`
    }
    default:
      throw new Error('Method not found.');
  }
};
