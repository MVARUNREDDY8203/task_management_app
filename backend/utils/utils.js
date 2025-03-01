import bcryptjs from "bcryptjs";

export function escapeSingleQuotes(value) {
    if (typeof value !== "string") {
        return value; // Return as-is if it's not a string (or throw an error if you want stricter handling)
    }
    return value.replace(/'/g, "''");
}

export async function generate_hash(payload) {
    const hash = await bcryptjs.hash(payload, 8);

    return hash;
}

export async function verify_hash(payload, target) {
    try {
        const result = await bcryptjs.compare(payload, target);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
}
