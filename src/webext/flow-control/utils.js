// @flow

import { select } from 'redux-saga/effects'
import qs from 'qs'

export function deleteUndefined<T: {}>(obj: T): T {
    // mutates obj
    for (const [k, v] of Object.entries(obj)) {
        if (v === undefined) delete obj[k];
    }
    return obj;
}

const NEXT_ID: { [string]: Id } = {};
export const getIdSaga = function* getId(reducer: string): Id {
    // reducer must have shpae { [Id]: { id } }
    if (!(reducer in NEXT_ID)) {
        const { [reducer]:entrys } = yield select();
        const ids = Object.keys(entrys);
        NEXT_ID[reducer] = (ids.length ? Math.max(...ids) : -1).toString();
    }
    return (++NEXT_ID[reducer]).toString();
}

const NEXT_ID_SYNC = {}
export function getId(reducer: string, state?: {}): Id {
    if (!state) {
        if (!(reducer in NEXT_ID_SYNC)) {
            NEXT_ID_SYNC[reducer] = 0;
        }
    } else {
        if (!(reducer in NEXT_ID_SYNC)) {
            const ids = Object.keys(state);
            NEXT_ID_SYNC[reducer] = (ids.length ? Math.max(...ids) : 0).toString();
        }
    }
    return (++NEXT_ID_SYNC[reducer]).toString();
}

/*
//
const REQUEST_ADD = A`REQUEST_ADD`;
type RequestAddAction = { type:typeof REQUEST_ADD, action:Action }
const requestAdd = (action): RequestAddAction => ({ type:REQUEST_ADD, action });

const requestAddSaga = function* requestAddSaga() {
    // re-run resume whenever resume action happens
    while (true) {
        yield take(REQUEST_ADD);
        const id = call(getId, 'pendings');
        yield put(add(action.action, id));
    }
}
sagas.push(requestAddSaga);
*/

export function fetchApi(input:string, init={}) {
    // adds the default headers in but doesnt overwrite if it already has those keys
    // if init.body is object, then it JSON.stringify's it
    // if input is string, and doesnt start with http, then `https://${fetchApi.DOMAIN}/api/` is prefixed to it

    // currently only supports string `input`

    const DOMAIN = 'https://foxified.sundayschoolonline.org';
    init.headers = Object.assign({
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }, init.headers);

    if (init.body) init.body = JSON.stringify(init.body);

    if (!input.startsWith('http')) input = `${DOMAIN}/api/${input}`;
    if (init.qs) {
        input += '?' + qs.stringify(init.qs);
        delete init.qs;
    }

    return fetch(input, init);
}

