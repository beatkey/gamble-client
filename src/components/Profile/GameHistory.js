import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Pagination} from "@mui/material";

export default function GameHistory() {
    const session = useSession()
    const [data, setData] = useState(null)
    const [page, setPage] = useState(0)

    function pageHandle(e, value) {
        setPage(value - 1)
    }

    async function fetchGameHistory() {
        try {
            const res = await fetch(`http://localhost:3001/games/game-history?page=${page}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': session.data.user.accessToken
                }
            })

            if (res.status === 200) {
                const result = await res.json()
                setData(result)
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchGameHistory()
    }, [page])

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Color</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Winner Number</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.data.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell>{row.color}</TableCell>
                                <TableCell>{row.amount}</TableCell>
                                <TableCell>{row.createdAt}</TableCell>
                                <TableCell>{row.game.number}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-center py-3">
                    <Pagination count={data && data.totalPages || 0} color="primary" onChange={pageHandle}/>
                </div>
            </TableContainer>
        </div>
    )
}
