import catalyst from "zcatalyst-sdk-node";

export async function get_tasks(req) {
    const app = catalyst.initialize(req);
    const zcql = app.zcql();

    const result = await zcql.executeZCQLQuery("SELECT * FROM tasks");
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

    const query = `
        UPDATE tasks 
        SET ${fields.join(", ")} 
        WHERE ROWID = ${req.params.task_id}
    `;
    const result = await zcql.executeZCQLQuery(query);

    return result;
}

export async function delete_task(req) {
    const app = catalyst.initialize(req);
    const zcql = app.zcql();

    let query = `DELETE FROM tasks WHERE ROWID = ${req.params.task_id}`;
    const delete_result = await zcql.executeZCQLQuery(query);

    return delete_result;
}

export async function post_task(req) {
    const app = catalyst.initialize(req);
    const zcql = app.zcql();
    // zcql insert query expects strings in single quotes
    function escapeSingleQuotes(value) {
        return value.replace(/'/g, "''"); // This handles cases like "Today's Task"
    }

    let title = escapeSingleQuotes(req.body.title);
    let description = escapeSingleQuotes(req.body.description);

    let query = `
        INSERT INTO tasks (title, description) 
        VALUES ('${title}', '${description}')
    `;

    const insert_result = await zcql.executeZCQLQuery(query);

    return insert_result;
}
