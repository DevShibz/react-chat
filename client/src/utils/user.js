import { decodeJWT } from "./utils";


class User{
    constructor(_id, _username){
        this._id = decodeJWT().userId;
        this._username = decodeJWT().username;
    }
}

export default User;