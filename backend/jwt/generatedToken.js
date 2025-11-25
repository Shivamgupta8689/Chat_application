import jwt from "jsonwebtoken";

export const createTokenSaveCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
        expiresIn: "5d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
    });

    return token;
};
