import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

async function fetchUser(accessToken) {
    try {
        const response = await axios.get("http://localhost:3001/auth/user", {
            headers: {
                'x-access-token': accessToken
            }
        });
        return response.data;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials) {
                try {
                    const res = await fetch("http://localhost:3001/auth/login", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    })

                    if (res.status === 200){
                        const result = await res.json()
                        if (result.data.token) {
                            return result.data;
                        }
                    }else{
                        return null;
                    }
                } catch (e) {
                    throw new Error(e);
                }
            }
        })
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.name = user.name;
                token.surname = user.surname;
                token.email = user.email;
                token.accessToken = user.token;
                token.accessTokenExpiry = user.accessTokenExpiry;
                token.balance = user.balance;
                token.photo = user.photo;
            }
            return token
        },
        session: async ({ session, token }) => {
            if (token) {
                const data = await fetchUser(token.accessToken)
                session.user.name = data.name;
                session.user.surname = data.surname;
                session.user.email = data.email;
                session.user.accessToken = token.accessToken;
                session.user.accessTokenExpiry = token.accessTokenExpiry;
                session.user.balance = data.balance;
                session.user.photo = data.photo;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        //maxAge: 86400,
    },
    pages: {
        signIn: "/login"
    }
}

export default NextAuth(authOptions)
