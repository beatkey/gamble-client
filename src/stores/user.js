import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    balance: null,
}

const slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setBalance: (state, action) => {
            state.balance = action.payload
        }
    }
})

export const {setBalance} = slice.actions
export default slice.reducer
