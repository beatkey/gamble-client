import {toast} from "react-toastify";
import socket from "@/utils/socket";
import {setBalance} from "@/stores/user";
import {signOut, useSession} from "next-auth/react";
import {useDispatch, useSelector} from "react-redux";

export default function Players({setPlayedColor, amount, time, players}){
    const dispatch = useDispatch()
    const session = useSession()
    const balance = useSelector(state => state.user.balance)

    function checkBalance(amount) {
        return balance >= parseInt(amount);
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

    return (
        <div className="container mx-auto flex mt-5 gap-14">
            <div className="flex-1">
                <button disabled={time <= 1} onClick={() => playHandle("red")}
                        className={`w-full p-2 text-center text-lg font-bold cursor-pointer transition-all ${time <= 1 ? "bg-gray-600" : "bg-red-500 hover:bg-red-700"}`}>
                    1 to 7
                </button>
                <div className="mt-3">
                    {players.red.map((value, index) =>
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
                    {players.green.map((value, index) =>
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
                    {players.black.map((value, index) =>
                        <div key={index} className="text-lg">{value.name} - {value.amount}</div>
                    )}
                </div>
            </div>
        </div>
    )
}
