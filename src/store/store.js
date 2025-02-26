import { configureStore } from "@reduxjs/toolkit";

import SummarySlice from "./SummarySlice";
import UserSlice from "./UserSlice";


const store=configureStore({
    reducer:({
        summary:SummarySlice,
        user:UserSlice

    })
})

export default store