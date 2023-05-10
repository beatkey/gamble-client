import Head from "next/head";
import Image from "next/image";

import roulettePng from "/public/roulette.png"
import {useEffect, useRef, useState} from "react";
import socket from "@/utils/socket";
import {signOut, useSession} from "next-auth/react";
import {Button} from "@mui/material";
import Link from "next/link";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {setBalance} from "@/stores/user";

export default function Home() {
    const dispatch = useDispatch()
    const session = useSession()
    //console.log(session)

    const {balance} = useSelector(state => state.user)
    const [time, setTime] = useState(null)

    const [amount, setAmount] = useState(0)

    const [redPlayers, setRedPlayers] = useState([])
    const [greenPlayers, setGreenPlayers] = useState([])
    const [blackPlayers, setBlackPlayers] = useState([])

    const [spinDeg, setSpinDeg] = useState(0)
    const [spinDuration, setSpinDuration] = useState(0)
    const roulette = useRef()
    const [spinHistory, setSpinHistory] = useState([])

    function spinReset(range) {
        setSpinDuration(0)
        setSpinDeg(range - (360 * 5))
    }

    const giveEarnings = (randomNumber) => {
        if (randomNumber > 0 && randomNumber <= 7) { // red
            setRedPlayers(prevState => {
                prevState.map((value) => {
                    setBalance(prevState => prevState + value.amount * 2)
                })
                return prevState
            })
        } else if (randomNumber > 7 && randomNumber <= 14) { // black
            setBlackPlayers(prevState => {
                prevState.map((value) => {
                    setBalance(prevState => prevState + value.amount * 2)
                })
                return prevState
            })
        } else { // green
            setGreenPlayers(prevState => {
                prevState.map((value) => {
                    setBalance(prevState => prevState + value.amount * 14)
                })
                return prevState
            })
        }

        setRedPlayers([])
        setBlackPlayers([])
        setGreenPlayers([])
    }

    function spin(randomNumber, range, raffleTime) {
        setSpinDuration(raffleTime)
        setSpinDeg(range + (360 * 5)) // spin range + (360 * spin rep)

        setTimeout(() => {
            spinReset(range)
            setSpinHistory(prevState => [{
                number: randomNumber
            }, ...prevState])
            giveEarnings(randomNumber)
        }, raffleTime)
    }

    function playHandle(color) {
        if (session && session.status === "unauthenticated") {
            toast("You need to login to play.", {
                type: "error",
                position: "top-right",
            });
            return;
        }

        if (time <= 1) {
            return
        }

        if (!socket.connected) {
            toast("Server error", {
                type: "error",
                position: "top-right",
            });
            return;
        }

        if (amount.toString().length > 1 && amount > 0 && checkBalance(amount)) {
            socket.emit("playHandle", {
                color: color,
                amount: amount,
                token: session.data.user.accessToken
            }, (res) => {
                if (res.status) {
                    dispatch(setBalance(balance - amount))

                    toast(`${color.charAt(0).toUpperCase() + color.slice(1)} ${amount} played.`, {
                        type: "success",
                        position: "top-right",
                    });
                } else {
                    toast(res.message, {
                        type: "error",
                        position: "top-right",
                    });
                }
            });
        }
    }

    function checkBalance(amount) {
        return balance >= parseInt(amount);
    }

    async function fetchSpinHistory() {
        const res = await fetch("http://localhost:3001/games/spin-history", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (res.status === 200){
            const result = await res.json()
            setSpinHistory(result.data)
        }
    }

    useEffect(() => {
        fetchSpinHistory()

        socket.on("getGameTime", (time) => {
            setTime(time)
        });

        socket.on("spin", ({randomNumber, range, raffleTime}) => {
            spin(randomNumber, range, raffleTime)
        });

        socket.on("updatePlayers", (players) => {
            setRedPlayers(players.red)
            setGreenPlayers(players.green)
            setBlackPlayers(players.black)
        });

        socket.emit("updatePlayers", (players) => {
            setRedPlayers(players.red)
            setGreenPlayers(players.green)
            setBlackPlayers(players.black)
        });
    }, [])

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main>
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
                                <>
                                    <Link href={'/login'}>
                                        <Button type="button" className="w-full" variant="outlined">Login</Button>
                                    </Link>
                                </>
                        }
                    </div>
                </div>
                <div className="container mx-auto flex justify-center">
                    <div className="relative mt-10">
                        <div ref={roulette} style={{
                            transform: `rotate(${spinDeg}deg)`,
                            transition: `transform ${spinDuration}ms cubic-bezier(0.32, 0.95, 0.45, 1) 0ms`
                        }}>
                            <Image src={roulettePng} alt="Roulette"/>
                        </div>
                        <div
                            className="absolute w-full h-full text-5xl inset-0 flex items-center justify-center">
                            {time === 0 ? "Raffling" : time}
                        </div>
                        <div
                            className="absolute top-1/2 -right-7 -translate-y-1/2 -translate-x-1/2 border-t-[25px] border-r-[25px] border-b-[25px] border-t-transparent border-b-transparent"></div>
                    </div>
                </div>
                <div className="flex justify-center gap-3 mt-10">
                    {spinHistory.slice(0, 10).map((value, index) => {
                        if (value.number > 0 && value.number <= 7) {
                            return <div
                                className={`w-8 h-8 flex justify-center items-center rounded-full text-base font-bold bg-red-600`}
                                key={index}>{value.number}</div>
                        } else if (value.number > 7 && value.number <= 14) {
                            return <div
                                className={`w-8 h-8 flex justify-center items-center rounded-full text-base font-bold bg-black`}
                                key={index}>{value.number}</div>
                        } else {
                            return <div
                                className={`w-8 h-8 flex justify-center items-center rounded-full text-base font-bold bg-green-500`}
                                key={index}>{value.number}</div>
                        }
                    })}
                </div>
                <div className="container mx-auto mt-10">
                    <div className="text-lg font-bold">
                        Balance: {balance}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-3">
                        <button className="px-3 py-1 bg-green-600"
                                onClick={() => setAmount(prevState => parseInt(prevState + 10))}>
                            +10
                        </button>
                        <button className="px-3 py-1 bg-green-600"
                                onClick={() => setAmount(prevState => parseInt(prevState + 100))}>
                            +100
                        </button>
                        <button className="px-3 py-1 bg-green-600"
                                onClick={() => setAmount(prevState => parseInt(prevState + 1000))}>
                            +1000
                        </button>
                        <button className="px-3 py-1 bg-green-600"
                                onClick={() => setAmount(prevState => parseInt(prevState + prevState / 2))}>
                            +50%
                        </button>
                        <button className="px-3 py-1 bg-red-600"
                                onClick={() => setAmount(prevState => parseInt(prevState - prevState / 2))}>
                            -50%
                        </button>
                        <button className="px-3 py-1 bg-red-600"
                                onClick={() => setAmount(prevState => parseInt(prevState - 1000))}>
                            -1000
                        </button>
                        <button className="px-3 py-1 bg-red-600"
                                onClick={() => setAmount(prevState => parseInt(prevState - 100))}>
                            -100
                        </button>
                        <button className="px-3 py-1 bg-red-600"
                                onClick={() => setAmount(prevState => parseInt(prevState - 10))}>
                            -10
                        </button>
                        <button className="px-3 py-1 bg-gray-600" onClick={() => setAmount(0)}>
                            Clear
                        </button>
                    </div>
                    <div className="mt-4">
                        <input
                            className="w-1/4 p-2 text-center text-black text-lg outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            type="number" onChange={e => setAmount(parseInt(e.target.value))} min={0}
                            value={amount}/>
                    </div>
                </div>
                <div className="container mx-auto flex mt-5 gap-14">
                    <div className="flex-1">
                        <button disabled={time <= 1} onClick={() => playHandle("red")}
                                className={`w-full p-2 text-center text-lg font-bold cursor-pointer transition-all ${time <= 1 ? "bg-gray-600" : "bg-red-500 hover:bg-red-700"}`}>
                            1 to 7
                        </button>
                        <div className="mt-3">
                            {redPlayers.map((value, index) =>
                                <div key={index} className="text-lg">{value.name} - {value.amount}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <button disabled={time <= 1} onClick={() => playHandle("green")}
                                className={`w-full p-2 text-center text-lg font-bold cursor-pointer transition-all ${time <= 1 ? "bg-gray-600" : "bg-green-500 hover:bg-green-700"}`}>
                            0
                        </button>
                        <div className="mt-3">
                            {greenPlayers.map((value, index) =>
                                <div key={index} className="text-lg">{value.name} - {value.amount}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <button disabled={time <= 1} onClick={() => playHandle("black")}
                                className={`w-full p-2 text-center text-lg font-bold cursor-pointer transition-all ${time <= 1 ? "bg-gray-600" : "bg-black hover:bg-gray-950"}`}>
                            8 to 14
                        </button>
                        <div className="mt-3">
                            {blackPlayers.map((value, index) =>
                                <div key={index} className="text-lg">{value.name} - {value.amount}</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
