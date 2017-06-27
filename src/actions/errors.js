// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {ErrorTypes} from 'action_types';
import serializeError from 'serialize-error';
import Client from 'client';
import EventEmitter from 'utils/event_emitter';

export function dismissErrorObject(index) {
    return {
        type: ErrorTypes.DISMISS_ERROR,
        index
    };
}

export function dismissError(index) {
    return async (dispatch) => {
        dispatch(dismissErrorObject(index));
    };
}

export function getLogErrorAction(error, displayable = false) {
    return {
        type: ErrorTypes.LOG_ERROR,
        displayable,
        error
    };
}

export function logError(error, displayable = false) {
    return async (dispatch) => {
        const serializedError = serializeError(error);

        try {
            const stringifiedSerializedError = JSON.stringify(serializedError).toString();
            await Client.logClientError(stringifiedSerializedError);
        } catch (err) {
          // avoid crashing the app if an error sending
          // the error occurs.
        }

        EventEmitter.emit(ErrorTypes.LOG_ERROR, error);
        dispatch(getLogErrorAction(serializedError, displayable));
    };
}

export function clearErrors() {
    return async (dispatch) => {
        dispatch({type: ErrorTypes.CLEAR_ERRORS});
    };
}
