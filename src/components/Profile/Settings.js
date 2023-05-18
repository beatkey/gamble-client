import {useSession} from "next-auth/react";
import {Button, TextField} from "@mui/material";
import {toast} from "react-toastify";
import {useState} from "react";

export default function Settings(){
    const session = useSession()
    const user = session.data.user
    const [name, setName] = useState(user.name)
    const [surname, setSurname] = useState(user.surname)
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState("")

    const submitHandle = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3001/auth/update-information", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': user.accessToken
                },
                body: JSON.stringify({
                    name,
                    surname,
                    email,
                    password
                })
            })
            const result = await res.json()
            if (res.status === 200){
                toast("Update success", {
                    type: "success",
                    position: "top-right",
                    autoClose: 2000,
                });
            }else{
                toast(result.error, {
                    type: "error",
                    position: "top-right",
                });
            }
        }catch (e){
            console.error(e)
            toast("Server Error", {
                type: "error",
                position: "top-right",
            });
        }
    }

    return (
        <div>
            <form className="flex flex-col items-center" onSubmit={submitHandle}>
                <div className="mb-4">
                    <TextField
                        required
                        type="text"
                        label="Name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <TextField
                        required
                        type="text"
                        label="Surname"
                        name="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <TextField
                        disabled={true}
                        type="email"
                        label="Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mt-2">
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        minRows={6}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mt-2">
                    <Button type="submit" className="w-full" variant="outlined">Update</Button>
                </div>
            </form>
        </div>
    )
}
