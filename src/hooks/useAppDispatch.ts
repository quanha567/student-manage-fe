import { useDispatch } from 'react-redux'

import { AppThunkDispatch } from '@/redux'

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
