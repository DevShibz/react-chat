const decodeJWT = (token) => {
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


module.exports = {
    decodeJWT
};