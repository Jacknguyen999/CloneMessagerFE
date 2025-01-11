

const initialValue = {
    chat : [],
    createdGroup : null,
    createdChat : null,

}

export const chatReducer = (store = initialValue, { type, payload }) => {
    switch (type) {
        case 'CREATE_CHAT':
            return {
                ...store,
                createdChat: payload,
                chat: [...store.chat, payload], // Add the new chat to the chat array
            };
        case 'CREATE_GROUP':
            return { ...store, createdGroup: payload };
        case 'GET_USERS_CHAT':
            return { ...store, chat: payload };
        default:
            return store;
    }
};
