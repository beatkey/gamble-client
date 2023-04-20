import {TextField, Button} from "@mui/material";
import {useState} from "react";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submitHandle = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        const result = await res.json()
        console.log(result)
    };
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <form onSubmit={submitHandle}>
                <div>
                    <TextField
                        required
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mt-2">
                    <TextField
                        required
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        minRows={6}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mt-2">
                    <Button type="submit" className="w-full" variant="outlined">Login</Button>
                </div>
            </form>
        </div>
    )
}
