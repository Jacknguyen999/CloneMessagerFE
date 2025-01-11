import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType";

const initalValue = {
    messages: [],
    newMessage: null,
};

export const messageReducer = (state = initalValue, action) => {
    const { type, payload } = action; 

    if (type === CREATE_NEW_MESSAGE) {
        return {
            ...state,
            newMessage: payload,
        };
    } else if (type === GET_ALL_MESSAGE) {
        return {
            ...state,
            messages: payload,
        };
    }

    return state;
};
