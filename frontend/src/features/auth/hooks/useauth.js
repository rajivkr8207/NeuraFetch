// src/hooks/useAuth.js

import { useDispatch, useSelector } from "react-redux";
import { ChangePasswordUser, getme, loginUser, logoutUser, profileUser, registerUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { setIsLoading, setUser } from "../auth.slice";
import { toast } from 'react-toastify'
import { getErrorMessage } from "../../../utils/getErrorMessage";
const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user, isLoading, isError, } = useSelector(
        (state) => state.auth
    );
    const handleRegister = async (data) => {
        dispatch(setIsLoading(true))
        try {
            const res = await registerUser(data);
            toast.success(res.message)
            navigate('/login')
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            dispatch(setIsLoading(false))
        }
    };

    const handleLogin = async (data) => {
        dispatch(setIsLoading(true))
        try {
            const res = await loginUser(data)
            toast.success(res.message)
            dispatch(setUser(res.data.user))
            navigate('/')
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            dispatch(setIsLoading(false))
        }
    };

    const handleFetchProfile = async () => {
        dispatch(setIsLoading(true))
        try {
            const res = await profileUser()
            return res
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            dispatch(setIsLoading(false))
        }
    };


    const handleGetMe = async () => {
        dispatch(setIsLoading(true))
        try {
            const res = await getme()
            dispatch(setUser(res.data.user))
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setIsLoading(false))
        }

    };

    const handleLogout = async () => {
        dispatch(setIsLoading(true))
        try {
            const res = await logoutUser()
            toast.success(res.message)
            navigate('/login')
            dispatch(setUser(null))
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setIsLoading(false))
        }
    };

    const handleChangePassword = async (data) => {
        dispatch(setIsLoading(true))
        try {
            const res = await ChangePasswordUser(data)
            toast.success(res.message)
            navigate('/profile')
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setIsLoading(false))
        }
    };
    return {
        user,
        isLoading,
        isError,
        handleRegister,
        handleLogin,
        handleLogout,
        handleGetMe,
        handleChangePassword,
        handleFetchProfile
    };
};

export default useAuth;