import { io } from "socket.io-client";

export function mapStateToProps(state) {
    return {
        Data: state.data,
    };
};


export const decodeJWT = () => {
    const token = sessionStorage.getItem("token");
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

export const socket = io("http://localhost:3000", {
    autoConnect: false
});