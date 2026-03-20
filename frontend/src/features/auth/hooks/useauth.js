// src/hooks/useAuth.js

import { useDispatch, useSelector } from "react-redux";
import { getMe, loginUser, logoutUser, profileUser, registerUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { setIsLogin } from "../auth.slice";

const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user, isLoading, isError, } = useSelector(
        (state) => state.auth
    );

    const handleRegister = async (data) => {
        dispatch(setIsLogin(true))
        try {
            const res = await registerUser(data);
            console.log(res);
            navigate('/login')
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setIsLogin(false))
        }
    };

    const handleLogin = async (data) => {
        dispatch(setIsLogin(true))

        try {
            const res = await loginUser(data)
            console.log(res);
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setIsLogin(false))
        }
    };

    const handleFetchProfile = async () => {
        dispatch(setIsLogin(true))
        try {
            const res = await profileUser()
            console.log(res);
            return res
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setIsLogin(false))
        }
    };


    const handleGetMe = async () => {
        const res = await getMe()
        return res;
    };

    const handleLogout = async () => {
        dispatch(setIsLogin(true))
        try {
            const res = await logoutUser()
            return res;
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setIsLogin(false))
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
        handleFetchProfile
    };
};

export default useAuth;