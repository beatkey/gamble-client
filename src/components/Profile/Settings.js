import {signOut, useSession} from "next-auth/react";
import {Button, TextField} from "@mui/material";
import {toast} from "react-toastify";
import {useRef, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Image from "next/image";

export default function Settings() {
    const router = useRouter()
    const session = useSession()
    const fileInputRef = useRef()

    const user = session.data.user
    const [name, setName] = useState(user.name)
    const [surname, setSurname] = useState(user.surname)
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState("")
    const [photo, setPhoto] = useState("http://localhost:3001/" + user.photo)
    const [file, setFile] = useState(null)

    const submitHandle = async (e) => {
        e.preventDefault();

        const formData = new FormData()
        formData.append("name", name)
        formData.append("surname", surname)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("photo", file)

        try {
            await axios.post("http://localhost:3001/auth/update-information", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast("Update success.", {
                type: "success",
                position: "top-right",
                autoClose: 2000,
                onClose: () => {
                    router.reload()
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
    }

    function handleFileChange(e) {
        e.preventDefault()
        const file = e.target.files[0];

        if (file) {
            if (!file.type.startsWith('image/')) {
                return toast("You can upload just photo", {
                    type: "error",
                    position: "top-right",
                });
            }

            if (file.size > 1024 ** 2) {
                return toast("File size cannot exceed more than 2MB", {
                    type: "error",
                    position: "top-right",
                });
            }

            setPhoto(URL.createObjectURL(file))
            setFile(file)
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
                    <Button variant="outlined" onClick={() => fileInputRef.current.click()}>Upload Photo</Button>
                    <input ref={fileInputRef} className="hidden" type="file" onChange={handleFileChange}/>
                </div>
                <div className="mt-2">
                    <img className="w-56" src={photo} alt={"Profile Photo"}/>
                </div>
                <div className="mt-2">
                    <Button type="submit" className="w-full" variant="outlined">Update</Button>
                </div>
            </form>
        </div>
    )
}
