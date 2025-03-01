import catalyst from "zcatalyst-sdk-node";
import { escapeSingleQuotes } from "../utils/utils.js";

export async function get_tasks(req) {
    const app = catalyst.initialize(req);
    const zcql = app.zcql();

    const email = escapeSingleQuotes(req.body.email);

    const result = await zcql.executeZCQLQuery(
        `SELECT * FROM tasks WHERE author = '${email}'` // user can only get his/her tasks that the user has authored
    );
    console.log(result);
    return result;
}

export async function update_task(req) {
    const app = catalyst.initialize(req);
    const zcql = app.zcql();

    let fields = [];

    if (req.body.description) {
        fields.push(`description = '${req.body.description}'`);
    }
    if (req.body.pending) {
        fields.push(`pending = '${req.body.pending}'`);
    }

    if (fields.length === 0) {
        throw new Error("No fields to update");
    }

    const email = escapeSingleQuotes(req.body.email);
    const query = `
        UPDATE tasks 
        SET ${fields.join(", ")} 
        WHERE ROWID = ${req.params.task_id}
        AND author = '${email}'
    `;
    const result = await zcql.executeZCQLQuery(query);

    return result;
}

export async function delete_task(req) {
    const app = catalyst.initialize(req);
    const zcql = app.zcql();
    const email = escapeSingleQuotes(req.body.email);

    const query = `DELETE FROM tasks WHERE ROWID = ${req.params.task_id} AND author = '${email}'`;
    const delete_result = await zcql.executeZCQLQuery(query);

    return delete_result;
}

export async function post_task(req) {
    const app = catalyst.initialize(req);
    const zcql = app.zcql();

    const title = escapeSingleQuotes(req.body.title);
    const description = escapeSingleQuotes(req.body.description);
    const email = escapeSingleQuotes(req.body.email);

    const query = `
        INSERT INTO tasks (title, description, author) 
        VALUES ('${title}', '${description}', '${email}')
    `;

    const insert_result = await zcql.executeZCQLQuery(query);

    return insert_result;
}
