import {useEffect, useState} from "react";

export default function SpinHistory({spinHistory, setSpinHistory}){
    async function fetchSpinHistory() {
        try {
            const res = await fetch("http://localhost:3001/games/spin-history", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (res.status === 200) {
                const result = await res.json()
                setSpinHistory(result.data)
            }
        }catch (e){
            console.error(e)
        }
    }

    useEffect(() => {
        fetchSpinHistory()
    }, [])

    return (
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
    )
}
