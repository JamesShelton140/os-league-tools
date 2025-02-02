/* Redux toolkit middleware handles updates immutably, but eslint doesn't know that */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getFromLocalStorage, LOCALSTORAGE_KEYS } from '../client/localstorage-client';

const CURRENT_VERSION = 2;
const INITIAL_STATE = {
    version: CURRENT_VERSION,
    status: 'all',
    todo: 'all',
    ignored: 'hide',
    difficulty: null,
    categories: null,
    subcategories: null,
    skills: null,
    reorderEnabled: false,
};

export const filterSlice = createSlice({
    name: 'filters',
    initialState: INITIAL_STATE,
    reducers: {
        update: (state, action) => {
            state[action.payload.field] = action.payload.value;
        },
        reset: () => INITIAL_STATE,
    },
});

export const loadState = () => {
    const prevState = getFromLocalStorage(LOCALSTORAGE_KEYS.FILTER_STATE, INITIAL_STATE);
    if (prevState && prevState.version < CURRENT_VERSION) {
        // Clear data from old versions
        return INITIAL_STATE;
    }
    return prevState;
};

export const { update, reset } = filterSlice.actions;

export default filterSlice.reducer;
