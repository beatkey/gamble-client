import {configureStore} from "@reduxjs/toolkit";

import user from "@/stores/user";
import general from "@/stores/general";

const store = configureStore({
    reducer: {
        user,
        general
    }
})

export default store
