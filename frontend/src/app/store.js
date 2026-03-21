import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import themeReducer from '../theme.sclice'
export default configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
  },
})