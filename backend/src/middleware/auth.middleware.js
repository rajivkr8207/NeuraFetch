import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import config from "../config/config.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
    }
});