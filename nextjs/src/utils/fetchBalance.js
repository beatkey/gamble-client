import axios from "axios";
import {useCallback, useEffect} from "react";
import {useDispatch} from "react-redux";
import {setBalance} from "@/stores/user";

export default function () {
    const dispatch = useDispatch()

    try {
        const res = axios.get("/api/balance")
        useCallback(() => dispatch(setBalance(res.data.balance)), [dispatch])
    } catch (e) {
        console.error(e)
    }
}
