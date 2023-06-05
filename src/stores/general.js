import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    game: null,
}

const slice = createSlice({
    name: "general",
    initialState,
    reducers: {
        setGame: (state, action) => {
            state.game = action.payload
        }
    }
})

export const {setGame} = slice.actions
export default slice.reducer
