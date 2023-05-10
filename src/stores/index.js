import {configureStore} from "@reduxjs/toolkit";

import user from "@/stores/user";

const store = configureStore({
    reducer: {
        user
    }
})

export default store
