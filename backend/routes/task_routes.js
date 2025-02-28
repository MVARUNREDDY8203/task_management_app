import { Router } from "express";
import {
    delete_task,
    get_tasks,
    post_task,
    update_task,
} from "../services/task_services.js";

const task_router = Router();

task_router.get("/", async (req, res) => {
    try {
        const res_tasks = await get_tasks(req);
        res.send({
            message: "here are your tasks",
            data: res_tasks,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: error,
            message: "no buddy",
        });
        return;
    }
});

task_router.post("/", async (req, res) => {
    try {
        const insert_result = await post_task(req);
        res.send({
            message: `your task was created!`,
            data: insert_result,
        });
    } catch (error) {
        console.error(
            "ZCQL insert Error:",
            error?.response?.data || error?.message || error
        );
        res.status(500).send({
            message: `Your task ${req.params.task_id} was NOT created.`,
            error: error?.response?.data || error?.message || error,
        });
    }
});

task_router.delete("/:task_id", async (req, res) => {
    try {
        const delete_result = await delete_task(req);
        res.status(200).send({
            message: `your task ${req.params.task_id} was deleted: ${delete_result}`,
        });
    } catch (error) {
        console.error(
            "ZCQL Delete Error:",
            error?.response?.data || error?.message || error
        );
        res.status(500).send({
            message: `Your task ${req.params.task_id} was NOT deleted.`,
            error: error?.response?.data || error?.message || error,
        });
    }
});

task_router.put("/:task_id", async (req, res) => {
    try {
        const update_result = await update_task(req);
        res.status(200).send({
            message: `your task ${req.params.task_id} was udpated: ${update_result}`,
        });
    } catch (error) {
        console.error(
            "ZCQL Update Error:",
            error?.response?.data || error?.message || error
        );
        res.status(500).send({
            message: `Your task ${req.params.task_id} was NOT updated.`,
            error: error?.response?.data || error?.message || error,
        });
    }
});

export default task_router;
