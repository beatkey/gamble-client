import {Button, styled, TextField} from "@mui/material";
import {useState} from "react";

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
    const [message, setMessage] = useState("")

    function submitHandle(e){
        e.preventDefault()
        console.log(message)
    }

    return <>
        <div className="text-lg font-bold border-b p-3">
            Chat
        </div>
        <div>

        </div>
        <form onSubmit={submitHandle} className="p-3 flex gap-1.5">
            <CssTextField value={message} onChange={(e) => setMessage(e.target.value)} className="w-full" label="Message" variant="outlined"/>
            <Button type="submit" className="w-2/12" variant="outlined">Send</Button>
        </form>
    </>
}
