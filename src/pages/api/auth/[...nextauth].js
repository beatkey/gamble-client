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
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    }
}

export default NextAuth(authOptions)
