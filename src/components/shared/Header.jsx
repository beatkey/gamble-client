import {Link} from "react-router-dom";
import {Button} from "antd";
import useCurrentPath from "@/hooks/useCurrentPath.js";
import classNames from "classnames";

export default function Header() {
    const currentPath = useCurrentPath()

    const leftItems = [
        {
            name: "Roulette",
            path: "/"
        },
        {
            name: "Jackpot",
            path: "/jackpot"
        }
    ]

    const rightItems = [
        {
            name: "Login",
            path: "/login"
        },
        {
            name: "Register",
            path: "/register"
        }
    ]

    return <header className={"flex items-center gap-2 p-3"}>
        {leftItems.map((val, index) =>
            <Link key={index} to={val.path}>
                <Button className={classNames(
                    "hover:text-gray-700", {
                        "bg-gray-700 text-white": currentPath === val.path
                    })}
                >
                    {val.name}
                </Button>
            </Link>
        )}

        <div className="w-full mx-auto">

        </div>

        {rightItems.map((val, index) =>
            <Link key={index} to={val.path}>
                <Button className={classNames(
                    "hover:text-gray-700", {
                        "bg-gray-700 text-white": currentPath === val.path
                    })}
                >
                    {val.name}
                </Button>
            </Link>
        )}
    </header>
}