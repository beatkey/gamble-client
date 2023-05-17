export default function Players({playHandle, time, players}){
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
