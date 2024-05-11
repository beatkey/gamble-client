import {styled, TextField} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import socket from "@/utils/socket";
import {toast} from "react-toastify";
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#A0AAB4',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
        'color': 'white',
        '& fieldset': {
            borderColor: '#E0E3E7',
        },
        '&:hover fieldset': {
            borderColor: '#B2BAC2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#6F7E8C',
        },
    },
    '& .MuiInputLabel-root': {
        'color': 'white',
    }
});

export default function Chat() {
    const session = useSession()
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const chatWrapperRef = useRef(null)
    const [loading, setLoading] = useState(false)

    function submitHandle(e) {
        e.preventDefault()
        setLoading(true)
        if (session.status === "authenticated") {
            socket.emit("message", {
                token: session.data.user.accessToken,
                message
            }, (res) => {
                if (res.status) {
                    setMessage("")
                } else {
                    toast(res.message, {
                        type: "error",
                        position: "top-right",
                    });
                }
                setLoading(false)
            })
        }
    }

    async function fetchChatHistory() {
        try {
            const res = await fetch("http://localhost:3001/chat/chat-history", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (res.status === 200) {
                const result = await res.json()
                setMessages(prevState => [
                    ...prevState,
                    ...result.data
                ])
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchChatHistory()
        socket.on("message", ({name, surname, message, time}) => {
            setMessages(prevState => [
                ...prevState,
                {
                    name,
                    surname,
                    message,
                    time
                }
            ])
        })
    }, [])

    useEffect(() => {
        const chatWrapper = chatWrapperRef.current;
        chatWrapper.scrollTop = chatWrapper.scrollHeight;
    }, [messages])

    return <div className="w-3/12 mr-5 border grid h-[687px] grid-rows-[50px_calc(100%-130px)_80px]">
        <div className="text-lg font-bold border-b px-3 flex items-center">
            Chat
        </div>
        <div ref={chatWrapperRef} className="overflow-y-scroll">
            {
                messages.map((value, index, array) =>
                    <div className="p-2 break-words" key={index}>
                        {value.time} - {value.name} {value.surname}: {value.message}
                    </div>
                )
            }
        </div>
        {(session && session.status === "authenticated") ?
            <form onSubmit={submitHandle} className="p-3 flex gap-1.5">
                <CssTextField value={message} onChange={(e) => setMessage(e.target.value)} className="w-full"
                              label="Message" variant="outlined" required inputProps={{maxLength: 100, minLength: 2}}/>
                <LoadingButton
                    className="w-3/12"
                    type="submit"
                    endIcon={<SendIcon/>}
                    loading={loading}
                    loadingPosition="end"
                    variant="outlined"
                >
                    <span>Send</span>
                </LoadingButton>
            </form>
            :
            <div className="p-3 text-center text-lg font-bold">
                You have to login for chat
            </div>
        }
    </div>
}
