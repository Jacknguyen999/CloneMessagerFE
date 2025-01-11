
import { API_URL } from './../../Config/api';
import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from './ActionType';

export const createChatMessage = (messageData) => async(dispatch) => {

    try { 
            const res = await fetch(`${API_URL}/api/message/send`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(messageData.data)
            })
            const data = await res.json();
            console.log("Message : ",data);
            dispatch({type: CREATE_NEW_MESSAGE, payload: data});
    } catch (e) {
        console.log("ERROR CREATE NEW MESSAGE ",e);
    }

}

export const getAllChatMessage = (reqData) => async(dispatch) => {

    try { 
            const res = await fetch(`${API_URL}/api/message/chat/${reqData.chatId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                },
                
            })
            const data = await res.json();
            console.log("Message",data);
            dispatch({type: GET_ALL_MESSAGE, payload: data});
    } catch (e) {
        console.log("ERROR GET ALL USER MESSAGE ",e);
    }

}