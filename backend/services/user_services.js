import catalyst from "zcatalyst-sdk-node";
import { escapeSingleQuotes } from "../utils/utils.js";

export async function getUser(req) {
    const app = catalyst.initialize(req);
    const zcql = app.zcql();
    const email = escapeSingleQuotes(req.body.email);
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const find_result = await zcql.executeZCQLQuery(query);
    return find_result;
}

export async function createUser(req) {
    const app = catalyst.initialize(req);
    const zcql = app.zcql();
    const email = escapeSingleQuotes(req.body.email);
    const pwd_hash = escapeSingleQuotes(req.body.pwd_hash);
    const query = `INSERT INTO users (email, password) VALUES ('${email}','${pwd_hash}')`;
    const create_result = await zcql.executeZCQLQuery(query);
    return create_result;
}
