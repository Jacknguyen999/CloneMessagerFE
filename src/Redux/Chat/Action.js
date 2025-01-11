
import { type } from '@testing-library/user-event/dist/type';
import { API_URL } from './../../Config/api';
import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT } from './ActionType';

export const createChat = (chatData) => async(dispatch) => {
    try {
        const res = await fetch(`${API_URL}/api/chat/single`,{
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chatData.data),
        })
        const data = await res.json();
        console.log("Create chat " ,data);
        dispatch({type: CREATE_CHAT, payload: data})
    } catch (error) {
        console.log("Error creating chat", error);
    }
}

export const createGroupChat = (chatData) => async(dispatch) => {
    try {
        const res = await fetch(`${API_URL}/api/chat/group`,{
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chatData.data),
        })
        const data = await res.json();
        console.log("Create group chat chat " ,data);
        dispatch({type: CREATE_GROUP, payload: data})
    } catch (error) {
        console.log("Error creating group  chat", error);
    }
}

export const getUserChat = (chatData) => async(dispatch) => {
    try {
        const res = await fetch(`${API_URL}/api/chat/user`,{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json'
            },
            
        })
        const data = await res.json();
        console.log("User chat " ,data);
        dispatch({type: GET_USERS_CHAT, payload: data})
    } catch (error) {
        console.log("Error get user chat ", error);
    }
}

