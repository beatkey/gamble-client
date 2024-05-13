import Home from "@/views/Home.jsx";
import NotFound from "@/views/NotFound.jsx";
import Jackpot from "@/views/Jackpot.jsx";
import Login from "@/views/Login.jsx";
import Register from "@/views/Register.jsx";

const routes = [
    {
        name: "home",
        path: "/",
        component: Home
    },
    {
        name: "jackpot",
        path: "/jackpot",
        component: Jackpot
    },
    {
        name: "login",
        path: "/login",
        component: Login
    },
    {
        name: "register",
        path: "/register",
        component: Register
    },
    {
        name: "not-found",
        path: "*",
        component: NotFound
    }
]

export default routes