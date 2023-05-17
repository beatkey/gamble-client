import {Button} from "@mui/material";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useSelector} from "react-redux";

export default function Header(){
    const session = useSession()
    const balance = useSelector(state => state.user.balance)

    return (
        <div className="flex p-3">
            <div className="ml-auto">
                {
                    session.status === "authenticated" ?
                        <div className="flex items-center gap-5">
                            <div className="min-w-fit">
                                {session.data.user.name + " " + session.data.user.surname}
                            </div>
                            <div className="min-w-fit">
                                Balance: {balance}
                            </div>
                            <Button type="button" onClick={() => signOut()} className="w-full"
                                    variant="outlined">Logout</Button>
                        </div>
                        :
                        <div className="flex gap-2">
                            <Link href={'/login'}>
                                <Button type="button" className="w-full" variant="outlined">Login</Button>
                            </Link>
                            <Link href={'/register'}>
                                <Button type="button" className="w-full" variant="outlined">Register</Button>
                            </Link>
                        </div>
                }
            </div>
        </div>
    )
}
