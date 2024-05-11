import 'nextjs/src/styles/Globals.css'

import {Provider, useDispatch} from "react-redux"
import store from "nextjs/src/stores";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {SessionProvider, signOut, useSession} from "next-auth/react"
import {useEffect} from "react";
import {setBalance} from "@/stores/user";
import axios from "axios";

function App({Component, pageProps}) {
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
            const shouldRefreshTime = session.data.user.accessTokenExpiry - Date.now();

            if (shouldRefreshTime < 0) {
                signOut()
            } else {
                axios.defaults.headers.common["x-access-token"] = session.data.user.accessToken
                dispatch(setBalance(session.data.user.balance))
            }
        }
    }, [session])

    return children;
}

/*App.getInitialProps = async ({Component, ctx}) => {
    const session = await getSession(ctx)

    if (session) {
        const shouldRefreshTime = session.user.accessTokenExpiry - Date.now();

        if (shouldRefreshTime < 0) {

        }
    }

    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return {
        pageProps
    }
};*/

export default App
