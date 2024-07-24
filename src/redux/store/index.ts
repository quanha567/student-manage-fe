import {
    AnyAction,
    Store,
    ThunkDispatch,
    configureStore,
} from '@reduxjs/toolkit'

import { userReducer } from '../slices'

export const store: Store = configureStore({
    reducer: {
        userStore: userReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppThunkDispatch = ThunkDispatch<RootState, unknown, AnyAction>
