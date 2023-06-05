import {Button} from "@mui/material";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {setGame} from "@/stores/general";
import {useRouter} from "next/router";

export default function Header() {
    const router = useRouter()
    const session = useSession()
    const dispatch = useDispatch()
    const balance = useSelector(state => state.user.balance)
    const game = useSelector(state => state.general.game)

    function gameHandle(game) {
        router.push("/")
        dispatch(setGame(game))
    }

    const Games = () => {
        const games = ["roulette", "jackpot"]

        return games.map((value, index) =>
            <Button
                key={index}
                className={(value === game ? "bg-blue-500 text-white hover:bg-blue-500" : "")}
                onClick={() => gameHandle(value)} variant="outlined">
                {value}
            </Button>)
    }

    return (
        <div className="flex p-3">
            <div className="flex gap-2">
                {/*<Button onClick={() => gameHandle("roulette")} variant="outlined">Roulette</Button>
                <Button onClick={() => gameHandle("jackpot")} variant="outlined">Jackpot</Button>*/}
                <Games/>
            </div>
            <div className="ml-auto">
                {
                    session.status === "authenticated" ?
                        <div className="flex items-center gap-5">
                            <div className="min-w-fit">
                                <a href="/profile">
                                    {session.data.user.name + " " + session.data.user.surname} (Click to profile)
                                </a>
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
