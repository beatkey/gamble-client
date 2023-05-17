import {useSelector} from "react-redux";

export default function AmountControl({amount, setAmount, winAmount}) {
    const balance = useSelector(state => state.user.balance)

    return (
        <div className="container mx-auto mt-10">
            <div className="text-lg font-bold">
                Balance: {balance} {winAmount && <span className="text-green-400">+{winAmount}</span>}
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
    )
}
