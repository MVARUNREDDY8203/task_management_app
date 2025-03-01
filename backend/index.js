import express from "express";
import cors from "cors";
import task_router from "./routes/task_routes.js";
import user_router from "./routes/user_routes.js";

const app = express();
app.use(
    cors({
        origin: "*", // This allows requests from anywhere
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.headers);
    next();
});

const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3001;
app.get("/", (req, res) => {
    res.send({
        message: "welcome to task management app",
    });
});

app.use("/users", user_router);
app.use("/tasks", task_router);

app.listen(port, () => {
    console.log(`app running on https://localhost:${port}`);
});
