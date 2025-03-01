const JWT_SECRET = "thisisjustasecret";
import jwt from "jsonwebtoken";
export function authorization_middleware(req, res, next) {
    const token = req.headers["token"];
    if (!token) {
        res.status(400).send({
            message: "headers not included",
        });
        return;
    }
    try {
        const decoded_result = jwt.verify(token, JWT_SECRET);
        req.body.email = decoded_result.email;
        next();
    } catch (error) {
        console.error("middleware error:", error);
        res.status(500).json({
            message: "login failed",
            error: error?.response?.data || error?.message || error,
        });
    }
}
