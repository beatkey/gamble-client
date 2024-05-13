import {Route, Routes} from "react-router-dom";
import routes from "@/routes.js";

function createRoutes(routes) {
    return (
        <>
            {routes.map(route => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<route.component/>}>
                </Route>
            ))}
        </>
    )
}


export default function App() {
    return <>
        <Routes>
            {createRoutes(routes)}
        </Routes>
    </>
}