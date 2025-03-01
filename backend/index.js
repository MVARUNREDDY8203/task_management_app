import express from "express";
import task_router from "./routes/task_routes.js";
import user_router from "./routes/user_routes.js";

const app = express();
app.use(express.json());

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
