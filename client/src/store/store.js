import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../reducers/data";
export default configureStore({
    reducer: {
        data: dataReducer,
    },
});