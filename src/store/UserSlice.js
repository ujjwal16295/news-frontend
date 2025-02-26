import {createSlice} from "@reduxjs/toolkit"

const initialState={
    userDetail:[null,null,null]

}

const UserSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        ChangeUserid(state,action){
            state.userDetail = action.payload
        },
        
    }
})

export default UserSlice.reducer;
export const {ChangeUserid} =UserSlice.actions;
