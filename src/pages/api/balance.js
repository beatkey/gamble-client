import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import axios from "axios";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (session) {
        try {
            const data = await axios.get("http://localhost:3001/auth/balance", {
                headers: {
                    "x-access-token": session.user.accessToken
                }
            })
            console.log(data.data)

            res.status(200).send({
                balance: data.data.balance
            })
        } catch (e) {
            console.error(e)
            res.status(500).send({
                message: e.message
            })
        }
    } else {
        res.status(401)
    }
}
