const BASE_URL = 'http://localhost:3000/api/';
export const SEARCH_FRIENDS = (name) => {
    return {
        url: `${BASE_URL}searchFriend?name=${name}`,
        method: 'GET'
    }
}

export const LOGIN = (data)=>{
    return {
        url: `${BASE_URL}login`,
        method: 'POST',
        data
    }
}

export const REGISTER = (data)=>{
    return {
        url: `${BASE_URL}register`,
        method: 'POST',
        data
    }
}

export const FETCH_CHAT = (roomId)=>{
    return {
        url: `${BASE_URL}recent-chats`,
        method: 'POST',
        data: {roomId}
    }
}