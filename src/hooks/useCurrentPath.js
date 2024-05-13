import {matchRoutes, useLocation} from "react-router-dom";
import routes from "@/routes.js";

export default function useCurrentPath() {
    const location = useLocation()
    const [{route}] = matchRoutes(routes, location)

    return route.path
}