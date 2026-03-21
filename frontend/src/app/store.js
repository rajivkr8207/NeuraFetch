import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import themeReducer from '../theme.sclice'
import itemReducer from '../features/home/item.slice'


export default configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    items: itemReducer
  },
})