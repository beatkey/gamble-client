import Head from "next/head";
import Image from "next/image";

import roulettePng from "/public/roulette.png"
import {useEffect, useRef, useState} from "react";
import socket from "@/utils/socket";
import {signOut, useSession} from "next-auth/react";
import {Button} from "@mui/material";
import Link from "next/link";

export default function Home() {
    const session = useSession()
    const raffleTime = 3000
    const spinTime = 15

    const [time, setTime] = useState(spinTime)

    const [balance, setBalance] = useState(10000)

    const [amount, setAmount] = useState(0)

    const [redPlayers, setRedPlayers] = useState([])
    const [greenPlayers, setGreenPlayers] = useState([])
    const [blackPlayers, setBlackPlayers] = useState([])

    const [spinDeg, setSpinDeg] = useState(0)
    const [spinDuration, setSpinDuration] = useState(raffleTime)
    const roulette = useRef()
    const [spinHistory, setSpinHistory] = useState([]);
    const spinRange = {
        /*
        * 2 = -9deg - 14.3deg
        * 8 = 15deg - 38.2deg
        * 1 = 39.2deg - 62.3deg
        * 0 = 63.2deg - 86.2deg
        * 14 = 86.9deg - 110.6deg
        * 7 = 111.6deg - 134.4deg
        * 13 = 135.6deg - 158.6deg
        * 6 = 160deg - 182.7deg
        * 12 = 184deg - 206.8deg
        * 5 = 208.2deg - 230.8deg
        * 11 = 232.2deg - 254.8deg
        * 4 = 256.4deg - 278.7deg
        * 10 = 280deg - 302.6deg
        * 3 = 304deg - 326.3deg
        * 9 = 327.7deg - 350.2deg
        * 0 = green, 1-7 = red, 8-14 = black
        * */
        0: [63.2, 86.2],
        1: [39.2, 62.3],
        2: [-9, 14.3],
        3: [304, 326.3],
        4: [256.4, 278.7],
        5: [208.2, 230.8],
        6: [160, 182.7],
        7: [111.6, 134.4],
        8: [15, 38.2],
        9: [327.7, 350.2],
        10: [280, 302.6],
        11: [232.2, 254.8],
        12: [184, 206.8],
        13: [135.6, 158.6],
        14: [86.9, 110.6],
    }

    function spinReset(range) {
        setSpinDuration(0)
        setSpinDeg(range - (360 * 5))
        setTime(spinTime)
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

    function spin() {
        setSpinDuration(raffleTime)
        const randomNumber = Math.floor(Math.random() * 15);
        const min = spinRange[randomNumber][0]
        const max = spinRange[randomNumber][1]
        const range = parseFloat((Math.random() * (max - min) + min).toFixed(1))
        setSpinDeg(range + (360 * 5)) // spin range + (360 * spin rep)

        setTimeout(() => {
            spinReset(range)
            start()
            setSpinHistory(prevState => [randomNumber, ...prevState])
            giveEarnings(randomNumber)
        }, raffleTime)
    }

    function start() {
        const timer = setInterval(() => {
            setTime(time => {
                if (time > 0) {
                    return time - 1
                } else {
                    spin()
                    clearInterval(timer)
                    return 0
                }
            })
        }, 1000)
    }

    function playHandle(color) {
        socket.emit("playHandle", {
            color: color,
            amount: amount
        });

        if (time <= 1) {
            return
        }

        if(amount.toString().length > 1 && amount > 0 && checkBalance(amount)){
            switch (color) {
                case "red":
                    if (!redPlayers.find(value => value.name === "Emre")) {
                        const data = {
                            name: "Emre",
                            amount: parseInt(amount)
                        }
                        setRedPlayers(prevState => [data, ...prevState])
                        setBalance(prevState => prevState - amount)
                    }
                    break
                case "green":
                    if (!greenPlayers.find(value => value.name === "Emre")) {
                        const data = {
                            name: "Emre",
                            amount: parseInt(amount)
                        }
                        setGreenPlayers(prevState => [data, ...prevState])
                        setBalance(prevState => prevState - amount)
                    }
                    break
                case "black":
                    if (!blackPlayers.find(value => value.name === "Emre")) {
                        const data = {
                            name: "Emre",
                            amount: parseInt(amount)
                        }
                        setBlackPlayers(prevState => [data, ...prevState])
                        setBalance(prevState => prevState - amount)
                    }
                    break
            }
        }
    }

    function checkBalance(amount){
        return balance >= parseInt(amount);
    }

    useEffect(() => {
        start()
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
                                   {session.data.user.name}
                                   <Button type="button" onClick={() => signOut()} className="w-full" variant="outlined">Logout</Button>
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
                        if (value > 0 && value <= 7) {
                            return <div
                                className={`w-8 h-8 flex justify-center items-center rounded-full text-base font-bold bg-red-600`}
                                key={index}>{value}</div>
                        } else if (value > 7 && value <= 14) {
                            return <div
                                className={`w-8 h-8 flex justify-center items-center rounded-full text-base font-bold bg-black`}
                                key={index}>{value}</div>
                        } else {
                            return <div
                                className={`w-8 h-8 flex justify-center items-center rounded-full text-base font-bold bg-green-500`}
                                key={index}>{value}</div>
                        }
                    })}
                </div>
                <div className="container mx-auto mt-10">
                    <div className="text-lg font-bold">
                        Balance: {balance}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-3">
                        <button className="px-3 py-1 bg-green-600" onClick={() => setAmount(prevState => parseInt(prevState + 10))}>
                            +10
                        </button>
                        <button className="px-3 py-1 bg-green-600" onClick={() => setAmount(prevState => parseInt(prevState + 100))}>
                            +100
                        </button>
                        <button className="px-3 py-1 bg-green-600" onClick={() => setAmount(prevState => parseInt(prevState + 1000))}>
                            +1000
                        </button>
                        <button className="px-3 py-1 bg-green-600" onClick={() => setAmount(prevState => parseInt(prevState + prevState / 2))}>
                            +50%
                        </button>
                        <button className="px-3 py-1 bg-red-600" onClick={() => setAmount(prevState => parseInt(prevState - prevState / 2))}>
                            -50%
                        </button>
                        <button className="px-3 py-1 bg-red-600" onClick={() => setAmount(prevState => parseInt(prevState - 1000))}>
                            -1000
                        </button>
                        <button className="px-3 py-1 bg-red-600" onClick={() => setAmount(prevState => parseInt(prevState - 100))}>
                            -100
                        </button>
                        <button className="px-3 py-1 bg-red-600" onClick={() => setAmount(prevState => parseInt(prevState - 10))}>
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
