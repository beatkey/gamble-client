import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                //console.log(credentials)
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
                    const result = await res.json()
                    console.log(result)
                    if (result.data.token) {
                        return result.data;
                    }

                    return null;
                } catch (e) {
                    throw new Error(e);
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    }
}

export default NextAuth(authOptions)
