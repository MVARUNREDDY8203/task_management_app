import { useState } from "react";
import axios from "axios";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    function getCSRFToken() {
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split("=");
            if (name === "ZD_CSRF_TOKEN") {
                return value;
            }
        }
        return "";
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const csrfToken = getCSRFToken();
        if (!csrfToken) {
            console.error("CSRF token not found");
            alert("CSRF token missing. Please refresh the page and try again.");
            return;
        }
        console.log(csrfToken);

        try {
            const response = await axios.post(
                "https://backend-50025174948.development.catalystappsail.in/users/signup",
                {
                    email,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-ZCSRF-TOKEN": csrfToken,
                    },
                }
            );
            console.log(response);
            alert("Signup successful! Please login.");
        } catch (error) {
            alert("error");
            console.log(error);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-slate-950 text-white">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-96">
                <div className="text-2xl font-bold mb-6 text-center">
                    SignUP
                </div>
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log(email, password);
                        handleSignup(e);
                    }}
                >
                    <div className="flex flex-col">
                        <label className="mb-1">Email</label>
                        <input
                            className="p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1">Password</label>
                        <input
                            className="p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
                    >
                        SignUp
                    </button>
                </form>
            </div>
        </div>
    );
}
