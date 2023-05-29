import Image from "next/image";
import roulettePng from "../../../public/roulette.png";
import {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";

export default function Roulette({time, spin, setSpin, setSpinHistory, playedColor, giveEarning}) {
    const session = useSession()

    const [spinDeg, setSpinDeg] = useState(0)
    const [spinDuration, setSpinDuration] = useState(0)
    const roulette = useRef()

    function spinReset() {
        setSpinDuration(0)
        setSpinDeg(spin.range - (360 * 5))
        setSpin({
            spinning: false,
            randomNumber: null,
            range: null,
            raffleTime: null
        })
    }

    function spinHandle() {
        setSpinDuration(spin.raffleTime)
        setSpinDeg(spin.range + (360 * 5)) // spin range + (360 * spin rep)

        setTimeout(() => {
            spinReset()
            setSpinHistory(prevState => [{
                number: spin.randomNumber
            }, ...prevState])

            if (session.status === "authenticated" && playedColor.length > 0) {
                giveEarning(spin.randomNumber)
            }
        }, spin.raffleTime)
    }

    const TimeText = () => {
        switch (time) {
            case null:
                return <div className="absolute w-full h-full text-3xl inset-0 flex items-center justify-center">
                    Loading...
                </div>
            case 0:
                return <div className="absolute w-full h-full text-3xl inset-0 flex items-center justify-center">
                    Raffling...
                </div>
            default:
                return <div className="absolute w-full h-full text-5xl inset-0 flex items-center justify-center">
                    {time}
                </div>
        }
    }

    useEffect(() => {
        if (spin.spinning){
            spinHandle()
        }
    }, [spin])

    return <div className="container mx-auto flex justify-center">
        <div className="relative mt-10">
            <div ref={roulette} style={{
                transform: `rotate(${spinDeg}deg)`,
                transition: `transform ${spinDuration}ms cubic-bezier(0.32, 0.95, 0.45, 1) 0ms`
            }}>
                <Image src={roulettePng} alt="Roulette"/>
            </div>
            <TimeText/>
            <div
                className="absolute top-1/2 -right-7 -translate-y-1/2 -translate-x-1/2 border-t-[25px] border-r-[25px] border-b-[25px] border-t-transparent border-b-transparent"></div>
        </div>
    </div>
}
