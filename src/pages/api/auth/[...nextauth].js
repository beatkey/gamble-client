import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

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
        jwt: async ({ token, user }) => {
            if (user) {
                token.name = user.name;
                token.surname = user.surname;
                token.email = user.email;
                token.accessToken = user.token;
                token.balance = user.balance;
                token.accessTokenExpiry = user.accessTokenExpiry;
            }

            return token
        },
        session: ({ session, token }) => {
            if (token) {
                session.user.name = token.name;
                session.user.surname = token.surname;
                session.user.email = token.email;
                session.user.accessToken = token.accessToken;
                session.user.accessTokenExpiry = token.accessTokenExpiry;
                session.user.balance = token.balance;
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
