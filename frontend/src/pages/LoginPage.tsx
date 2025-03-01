import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <div className="h-screen flex justify-center items-center bg-slate-950 text-white">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-96">
                <div className="text-2xl font-bold mb-6 text-center">Login</div>
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log(email, password);
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
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
