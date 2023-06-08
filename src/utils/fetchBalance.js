import {useSession} from "next-auth/react";
import axios from "axios";
import {useEffect} from "react";

export default function fetchBalance() {
    const session = useSession()

    useEffect(async () => {
        if (session && session.status === "authenticated") {
            console.log(session)
            try {
                const res = await axios.get("http://localhost:3001/auth/balance")
                //console.log(res)
                /*const res = await fetch("http://localhost:3001/auth/balance", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': session.data.user.accessToken
                    },
                })*/

                /*if (res.status === 200) {
                    const result = await res.json()
                    if (result.data) {
                        dispatch(setBalance(result.data))
                    }
                }*/
            } catch (e) {
                //console.error(e)
            }
        }
    }, [session])
}
