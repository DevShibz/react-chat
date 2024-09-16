import { io } from "socket.io-client";

export function mapStateToProps(state) {
    return {
        Data: state.data,
    };
};


export const decodeJWT = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
        return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload;
};

export const fetchApi = async (config) => {
    try {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        };
        let method = config.method;
        const requestOptions = {
            method,
            headers,
        };

        if (config.data) {
            requestOptions.body = JSON.stringify(config.data);
        }



        const response = await fetch(config.url, requestOptions);
        return response.json();
    }
    catch (err) {
        console.log(err);
        throw (handleAllErrors(err));
    }

};

const handleAllErrors = (error) => {
    return {
        code: error.code,
        message: error.message,

    };
}

export const socket = io("http://localhost:3000", {
    autoConnect: false
});