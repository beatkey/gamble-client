import '@/styles/globals.css'

import {Provider, useDispatch} from "react-redux"
import store from "@/stores";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {SessionProvider, useSession} from "next-auth/react"
import {setBalance} from "@/stores/user";
import {useEffect} from "react";

function App({Component, user, pageProps}) {
    return <Provider store={store}>
        <SessionProvider session={pageProps.session}>
            <User>
                <Component {...pageProps} />
            </User>
            <ToastContainer/>
        </SessionProvider>
    </Provider>
}

const User = ({children}) => {
    const session = useSession()
    const dispatch = useDispatch()

    useEffect(() => {
        if (session.status === "authenticated") {
            getBalance(session.data.user.accessToken)
        }
    })

    async function getBalance(token){
        const res = await fetch("http://localhost:3001/user/balance", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
        })

        if (res.status === 200){
            const result = await res.json()
            dispatch(setBalance(result.data))
        }
    }

    return children;
}

/*App.getInitialProps = async ({Component, ctx}) => {
    const session = await getSession(ctx)

    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    if (!session) {
        return {
            pageProps
        }
    } else {
        const {user} = session
        return {
            user,
            pageProps
        }
    }
};*/

export default App
