import { Router } from "express";
import jwt from "jsonwebtoken";
import { createUser, getUser } from "../services/user_services.js";
import { generate_hash, verify_hash } from "../utils/utils.js";
const JWT_SECRET = "thisisjustasecret";

const user_router = Router();

user_router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email and password are required" });
    }

    try {
        const user_exists = await getUser(req);
        if (user_exists.length != 0) {
            res.status(400).send({
                message: `user with email: ${email} already exists, go to login or signup w diff email`,
            });
            return;
        }

        const pwd_hash = await generate_hash(password);
        req.body.pwd_hash = pwd_hash;

        const create_user_result = await createUser(req);
        const token = jwt.sign(
            {
                email: email,
            },
            JWT_SECRET
        );

        res.status(200).send({
            message: "user created successfully",
            token: token,
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Signup failed",
            error: error?.response?.data || error?.message || error,
        });
    }
    // try {
    //     const app = catalyst.initialize(req);
    //     const userManagement = app.userManagement();
    //     let signup_config = {
    //         platform_type: "web",
    //         zaid: 8488000000008022,
    //     };
    //     var userConfig = {
    //         last_name: `${password}`,
    //         email_id: `${email}`,
    //         role_id: "8488000000008038",
    //     };

    //     const signupResponse = await userManagement.registerUser(
    //         signup_config,
    //         userConfig
    //     );

    //     res.status(201).json({
    //         message:
    //             "User registered successfully. Please verify your email before login.",
    //         data: signupResponse,
    //     });
    // } catch (error) {
    //     console.error("Signup error:", error);
    //     res.status(500).json({
    //         message: "Signup failed",
    //         error: error?.response?.data || error?.message || error,
    //     });
    // }
});

user_router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user_exists = await getUser(req);
        if (user_exists.length == 0) {
            res.status(400).send({
                message: `user with email: ${email} doesnt exists, go to signup`,
            });
            return;
        }

        const curr_user = user_exists[0];
        const pwd_hash = curr_user.password;
        const valid_credentials = verify_hash(password, pwd_hash);

        if (valid_credentials) {
            const jwt_token = jwt.sign(
                {
                    email: email,
                },
                JWT_SECRET
            );
            res.send({
                message: "login successful",
                token: jwt_token,
            });
        } else {
            res.send({
                message: "wrong credentials",
                valid_credentials: valid_credentials,
            });
        }
    } catch (error) {
        console.error("login error:", error);
        res.status(500).json({
            message: "login failed",
            error: error?.response?.data || error?.message || error,
        });
    }
});

export default user_router;
