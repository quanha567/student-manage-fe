import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { UserModel } from '@/models'

import { RootState } from '../store'

interface UserState {
    user: UserModel
}

const initialState: UserState = {
    user: {},
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserModel>) => {
            state.user = action.payload
        },
    },
})

export const { setUser } = userSlice.actions

export const selectCurrentUser = (state: RootState) =>
    state.userStore.user as UserModel

export default userSlice.reducer
