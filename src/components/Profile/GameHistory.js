import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function GameHistory(){
    const session = useSession()


    const [rows, setRows] = useState([])

    async function fetchGameHistory(){
        try {
            const res = await fetch("http://localhost:3001/games/game-history", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': session.data.user.accessToken
                }
            })

            if (res.status === 200) {
                const result = await res.json()
                console.log(result)
                setRows(result)
            }
        }catch (e){
            console.error(e)
        }
    }

    useEffect(() => {
        fetchGameHistory()
    }, [])

    return (
       <TableContainer component={Paper}>
           <Table sx={{ minWidth: 650 }} aria-label="simple table">
               <TableHead>
                   <TableRow>
                       <TableCell>Color</TableCell>
                       <TableCell>Amount</TableCell>
                       <TableCell>Time</TableCell>
                       <TableCell>Winner Number</TableCell>
                   </TableRow>
               </TableHead>
               <TableBody>
                   {rows.map((row, index) => (
                      <TableRow
                         key={index}
                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                          <TableCell>{row.color}</TableCell>
                          <TableCell>{row.amount}</TableCell>
                          <TableCell>{row.createdAt}</TableCell>
                          <TableCell>10 (Black)</TableCell>
                      </TableRow>
                   ))}
               </TableBody>
           </Table>
       </TableContainer>
    )
}
