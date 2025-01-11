
import { API_URL } from "../../Config/api"
import { LOGIN, LOGOUT, REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER } from "./ActionType";

export const register = (data) => async (dispatch) => {
    try{
        const res = await fetch(`${API_URL}/auth/signup`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const resData = await res.json();
        if (resData.jwt) localStorage.setItem("jwt",resData.jwt);

        console.log("register",resData);

        dispatch({type: REGISTER,payload : resData});


    } catch(e){
        console.log("error",e);
    }
}

export const login = (data) => async (dispatch) => {
    try{
        const res = await fetch(`${API_URL}/auth/login`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const resData = await res.json();
        console.log("login",resData);
        if (resData.jwt) localStorage.setItem("jwt",resData.jwt);
        
        dispatch({type: LOGIN,payload : resData});


    } catch(e){
        console.log("error",e);
    }
}

export const currentUser = (token) => async (dispatch) => {
    try{
        const res = await fetch(`${API_URL}/api/users/profile`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            
        })
        const resData = await res.json();
        console.log("Get Current User",resData);
        
        dispatch({type: REQ_USER,payload : resData});


    } catch(e){
        console.log("error",e);
    }
}

export const searchUser = (data) => async (dispatch) => {
    try {
        const keyword = data.keyword || ''; // Default to empty string if keyword is undefined
        const res = await fetch(`${API_URL}/api/users/search/${keyword}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
            },
        });
        const resData = await res.json();
        console.log("Get searched User", resData);

        // Assuming resData is an array of users with full_name and profile_pic
        dispatch({ type: SEARCH_USER, payload: resData });

    } catch (e) {
        console.log("error", e);
        dispatch({ type: SEARCH_USER, payload: [] }); // Dispatch empty array on error
    }
};

export const updateUser = ({ data, jwt }) => async (dispatch) => {
    try {
        const res = await fetch(`${API_URL}/api/users/update`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }

        const resData = await res.json();
        console.log("UPDATE USER", resData);

        dispatch({ type: UPDATE_USER, payload: resData });
    } catch (e) {
        console.error("Error updating user:", e);
    }
};


export const logOut = () =>async(dispatch) =>{
    localStorage.removeItem("jwt");
    dispatch({type: LOGOUT,payload : null});
    dispatch({type: REQ_USER,payload : null});  

}