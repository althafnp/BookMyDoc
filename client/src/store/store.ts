import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from './reducers/authSlice'

const rootReducer = combineReducers({
    auth: authReducer,
});

const store = configureStore({
    reducer: rootReducer,
    devTools: import.meta.env.MODE !== "production"
})



export default store;   
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;