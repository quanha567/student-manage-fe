import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { LOCAL_STORAGES } from '@/constants'
import { UserModel } from '@/models'
import { userService } from '@/services'

import { RootState } from '../store'

interface UserState {
    user: UserModel
}

const initialState: UserState = {
    user: {},
}

export const getUserInfo = createAsyncThunk(
    'users/getUserInfo',
    async (_, { dispatch, getState }) => {
        const isAuthenticated = localStorage.getItem(
            LOCAL_STORAGES.ACCESS_TOKEN,
        )
        const userInfo: UserModel | null = (getState() as RootState).userStore
            .user

        if (!isAuthenticated || (userInfo && Object.values(userInfo).length))
            return

        try {
            const userInfo = await userService.getInfo()
            dispatch(setUser(userInfo))
        } catch (err) {
            console.log(err)
        }
    },
)

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
