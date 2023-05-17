import Head from "next/head";
import Image from "next/image";

import roulettePng from "/public/roulette.png"
import {useEffect, useRef, useState} from "react";
import socket from "@/utils/socket";
import {signOut, useSession} from "next-auth/react";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {setBalance as setRootBalance} from "@/stores/user";
import Header from "@/components/Global/Header";
import SpinHistory from "@/components/Home/SpinHistory";
import Players from "@/components/Home/Players";
import AmountControl from "@/components/Home/AmountControl";

export default function Home() {
    const dispatch = useDispatch()
    const session = useSession()

    const balanceRoot = useSelector(state => state.user.balance)
    const [balance, setBalance] = useState(null)

    const [time, setTime] = useState(null)

    const [amount, setAmount] = useState(0)

    const [players, setPlayers] = useState({
        red: [],
        green: [],
        black: []
    })

    const [spinDeg, setSpinDeg] = useState(0)
    const [spinDuration, setSpinDuration] = useState(0)
    const roulette = useRef()

    const [spinHistory, setSpinHistory] = useState([])
    const [playedColor, setPlayedColor] = useState([])
    const [winAmount, setWinAmount] = useState(null)

    function spinReset(range) {
        setSpinDuration(0)
        setSpinDeg(range - (360 * 5))
    }

    const giveEarning = (randomNumber) => {
        if (randomNumber > 0 && randomNumber <= 7) { // red
            setPlayedColor(prevState => {
                const data = prevState.find(value => value.color === "red")
                if (data) {
                    setWinAmount(data.amount * 2)
                    setBalance(prevState => prevState + data.amount * 2)
                }
            })
        } else if (randomNumber > 7 && randomNumber <= 14) { // black
            setPlayedColor(prevState => {
                const data = prevState.find(value => value.color === "black")
                if (data) {
                    setWinAmount(data.amount * 2)
                    setBalance(prevState => prevState + data.amount * 2)
                }
            })
        } else { // green
            setPlayedColor(prevState => {
                const data = prevState.find(value => value.color === "green")
                if (data) {
                    setWinAmount(data.amount * 2)
                    setBalance(prevState => prevState + data.amount * 14)
                }
            })
        }

        setPlayedColor([])
        setTimeout(() => {
            setWinAmount(null)
        }, 2000)
    }

    function spin(randomNumber, range, raffleTime) {
        setSpinDuration(raffleTime)
        setSpinDeg(range + (360 * 5)) // spin range + (360 * spin rep)

        setTimeout(() => {
            spinReset(range)
            setSpinHistory(prevState => [{
                number: randomNumber
            }, ...prevState])
            giveEarning(randomNumber)
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
                    dispatch(setRootBalance(balance - amount))

                    setPlayedColor(prevState => [...prevState, {color, amount}])

                    toast(`${color.charAt(0).toUpperCase() + color.slice(1)} ${amount} played.`, {
                        type: "success",
                        position: "top-right",
                    });
                } else {
                    toast(res.message, {
                        type: "error",
                        position: "top-right",
                    });
                    if (res.code === "TOKEN_EXPIRED") {
                        signOut()
                    }
                }
            });
        }
    }

    function checkBalance(amount) {
        return balance >= parseInt(amount);
    }


    function socketHandle() {
        socket.on("getGameTime", (time) => {
            setTime(time)
        });

        socket.on("spin", ({randomNumber, range, raffleTime}) => {
            spin(randomNumber, range, raffleTime)
        });

        socket.on("updatePlayers", (players) => {
            setPlayers({
                red: players.red,
                green: players.green,
                black: players.black
            })
        });

        socket.emit("updatePlayers", (players) => {
            setPlayers({
                red: players.red,
                green: players.green,
                black: players.black
            })
        });
    }

    useEffect(() => {
        socketHandle()
    }, [])

    useEffect(() => {
        setBalance(balanceRoot)
    }, [balanceRoot])

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main>
                <Header/>
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
                <SpinHistory spinHistory={spinHistory} setSpinHistory={setSpinHistory}/>
                <AmountControl amount={amount} setAmount={setAmount} winAmount={winAmount}/>
                <Players playHandle={playHandle} time={time} players={players}/>
            </main>
        </>
    )
}
