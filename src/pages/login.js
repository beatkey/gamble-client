import {TextField, Button} from "@mui/material";

export default function Login(){
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <form>
                <div>
                    <TextField
                        required
                        type="email"
                        label="Email"
                    />
                </div>
                <div className="mt-2">
                    <TextField
                        required
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                    />
                </div>
                <div className="mt-2">
                    <Button className="w-full" variant="contained" component="label">Login</Button>
                </div>
            </form>
        </div>
    )
}
