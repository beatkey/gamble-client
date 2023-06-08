import Spinner from "@/components/Home/Roulette/Spinner";
import SpinHistory from "@/components/Home/Roulette/SpinHistory";
import AmountControl from "@/components/Home/Roulette/AmountControl";
import Players from "@/components/Home/Roulette/Players";
import {useEffect, useState} from "react";
import socket from "@/utils/socket";
import fetchBalance from "@/utils/fetchBalance";

export default function Roulette(){
    const [time, setTime] = useState(null)
    const [spin, setSpin] = useState({
        spinning: false,
        randomNumber: null,
        range: null,
        raffleTime: null
    })
    fetchBalance()
    const [amount, setAmount] = useState(0)

    const [players, setPlayers] = useState({
        red: [],
        green: [],
        black: []
    })

    const [spinHistory, setSpinHistory] = useState([])
    const [playedColor, setPlayedColor] = useState([])
    const [winAmount, setWinAmount] = useState(null)

    const giveEarning = (randomNumber) => {
        if (randomNumber > 0 && randomNumber <= 7) { // red
            const data = playedColor.find(value => value.color === "red")
            if (data) {
                //dispatch(setBalance(balance + data.amount * 2))
                setWinAmount(data.amount * 2)
            }
        } else if (randomNumber > 7 && randomNumber <= 14) { // black
            const data = playedColor.find(value => value.color === "black")
            if (data) {
                //dispatch(setBalance(balance + data.amount * 2))
                setWinAmount(data.amount * 2)
            }
        } else { // green
            const data = playedColor.find(value => value.color === "green")
            if (data) {
                //dispatch(setBalance(balance + data.amount * 14))
                setWinAmount(data.amount * 14)
            }
        }

        fetchBalance()
        setPlayedColor([])
        setTimeout(() => {
            setWinAmount(null)
        }, 2000)
    }

    useEffect(() => {
        socket.on("getGameTime", (time) => {
            setTime(time)
        })

        socket.on("spin", ({randomNumber, range, raffleTime}) => {
            setSpin({
                spinning: true,
                randomNumber,
                range,
                raffleTime
            })
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
    }, [])

    return <div className="w-full">
        <Spinner time={time} spin={spin} setSpin={setSpin} setSpinHistory={setSpinHistory} playedColor={playedColor} giveEarning={giveEarning} />
        <SpinHistory spinHistory={spinHistory} setSpinHistory={setSpinHistory}/>
        <AmountControl amount={amount} setAmount={setAmount} winAmount={winAmount}/>
        <Players setPlayedColor={setPlayedColor} amount={amount} time={time} players={players}/>
    </div>
}
