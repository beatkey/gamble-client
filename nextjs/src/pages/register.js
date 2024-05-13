import {TextField, Button} from "@mui/material";
import {useState} from "react";
import {useSession, signOut, getSession} from "next-auth/react"
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import Head from "next/head";

export default function Register() {
   const router = useRouter()
   const session = useSession()
   const [name, setName] = useState("")
   const [surname, setSurname] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")

   const submitHandle = async (e) => {
      e.preventDefault();

      try {
         const res = await fetch("http://localhost:3001/auth/register", {
            method: "POST",
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               name,
               surname,
               email,
               password
            })
         })
         const result = await res.json()
         if (res.status === 200){
            toast("Register success, redirecting to login page...", {
               type: "success",
               position: "top-right",
               autoClose: 2000,
               onClose: () => {
                  router.push("/login")
               }
            });
         }else{
            toast(result.error, {
               type: "error",
               position: "top-right",
            });
         }
      }catch (e){
         console.error(e)
         toast("Server Error", {
            type: "error",
            position: "top-right",
         });
      }
   }

   return (
      <>
         <Head>
            <title>Register</title>
            <meta name="description" content="Generated by create next app"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href="/favicon.ico"/>
         </Head>
         <div className="h-screen w-screen flex items-center justify-center">
            {session && session.status === "authenticated" ?
               <div>
                  {session.data.user.name}
                  <Button type="button" onClick={() => signOut()} className="w-full" variant="outlined">Logout</Button>
               </div>
               :
               <form onSubmit={submitHandle}>
                  <div className="mb-4">
                     <TextField
                        required
                        type="text"
                        label="Name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                     />
                  </div>
                  <div className="mb-4">
                     <TextField
                        required
                        type="text"
                        label="Surname"
                        name="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                     />
                  </div>
                  <div className="mb-4">
                     <TextField
                        required
                        type="email"
                        label="Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
                  <div className="mt-2">
                     <TextField
                        required
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        minRows={6}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>
                  <div className="mt-2">
                     <Button type="submit" className="w-full" variant="outlined">Register</Button>
                  </div>
               </form>
            }
         </div>
      </>
   )
}

export async function getServerSideProps(ctx) {
   const session = await getSession(ctx)
   if (session){
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
   }
   return {
      props: {
         session
      }
   }
}