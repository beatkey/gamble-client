import {signOut, useSession} from "next-auth/react";
import {Button, TextField} from "@mui/material";
import {toast} from "react-toastify";
import {useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

export default function Settings() {
    const router = useRouter()
    const session = useSession()
    const user = session.data.user
    const [name, setName] = useState(user.name)
    const [surname, setSurname] = useState(user.surname)
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState("")
    const [photo, setPhoto] = useState(null)

    const submitHandle = async (e) => {
        e.preventDefault();

        const formData = new FormData()
        formData.append("name", name)
        formData.append("surname", surname)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("photo", photo)

        try {
            await axios.post("http://localhost:3001/auth/update-information", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast("Update success, you have to login again.", {
                type: "success",
                position: "top-right",
                autoClose: 2000,
                onClose: () => {
                    /*signOut()
                    router.push("/login")*/
                }
            });
        } catch (e) {
            console.error(e);
            if (e.response) {
                if (e.response.status !== 500) {
                    toast(e.response.data.message, {
                        type: "error",
                        position: "top-right",
                    });
                } else {
                    toast("Server Error", {
                        type: "error",
                        position: "top-right",
                    });
                }
            } else {
                toast("Server Error", {
                    type: "error",
                    position: "top-right",
                });
            }
        }

        /*await axios.post("http://localhost:3001/auth/update-information", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            console.log(res)
            toast("Update success, you have to login again.", {
                type: "success",
                position: "top-right",
                autoClose: 2000,
                onClose: () => {
                    /!*signOut()
                    router.push("/login")*!/
                }
            });
        }).catch(err => {
            console.error(err)
            if (err.response.status === 500){
                toast("Server Error", {
                    type: "error",
                    position: "top-right",
                });
            }else{
                toast(err.response.data.message, {
                    type: "error",
                    position: "top-right",
                });
            }
        })*/
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (false/*file.size > 1024 ** 2*/) {
            e.preventDefault()
            alert("File size cannot exceed more than 1MB")
        } else {
            setPhoto(file)
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
                    <input type="file" onChange={handleFileChange}/>
                </div>
                <div className="mt-2">
                    <Button type="submit" className="w-full" variant="outlined">Update</Button>
                </div>
            </form>
        </div>
    )
}
