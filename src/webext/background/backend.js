// @flow

import { requestAdd } from '../flow-control/extensions'
import store, { persistor } from '../flow-control'

export function logIt(what) {
    console.log('logIt :: what:', what);
}

export function purgeStore() {
    persistor.purge();
}

export async function handleSubmitAddForm(values) {
    return await store.dispatch(requestAdd(values)).promise;
}