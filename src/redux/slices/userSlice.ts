import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { globalLoading } from '@/components'
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
    async (_, { dispatch }) => {
        globalLoading.current?.show()

        try {
            dispatch(setUser(await userService.getInfo()))
        } catch (err) {
            console.log(err)
        } finally {
            globalLoading.current?.close()
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
