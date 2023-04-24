import {TextField, Button} from "@mui/material";
import {useState} from "react";
import {useSession, signIn, signOut} from "next-auth/react"
import {toast} from "react-toastify";
import {useRouter} from "next/router";

export default function Login() {
   const router = useRouter()
   const session = useSession()
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")

   const submitHandle = async (e) => {
      e.preventDefault();
      try {
         await signIn("credentials", {
            email,
            password,
            redirect: false
         }).then((result) => {
            if (result.status === 200) {
               toast("Login success, redirecting...", {
                  type: "success",
                  position: "top-right",
                  autoClose: 2000,
                  onClose: () => {
                     router.push("/")
                  }
               });
            } else {
               if (result.error === "CredentialsSignin") {
                  toast("Email or password is wrong", {
                     type: "error",
                     position: "top-right",
                  });
               } else {
                  toast("Server Error", {
                     type: "error",
                     position: "top-right",
                  });
               }
            }
         })
      } catch (e) {
         console.log(e)
      }
   }

   return (
      <div className="h-screen w-screen flex items-center justify-center">
         {session && session.status === "authenticated" ?
            <div>
               {session.data.user.name}
               <Button type="button" onClick={() => signOut()} className="w-full" variant="outlined">Logout</Button>
            </div>
            :
            <form onSubmit={submitHandle}>
               <div>
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
                     autoComplete="current-password"
                     value={password}
                     minRows={6}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
               <div className="mt-2">
                  <Button type="submit" className="w-full" variant="outlined">Login</Button>
               </div>
            </form>
         }
      </div>
   )
}
