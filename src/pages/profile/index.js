import {getSession} from "next-auth/react";
import Header from "@/components/Global/Header";
import Head from "next/head";
import {useState} from "react";
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Settings from "@/components/Profile/Settings";
import GameHistory from "@/components/Profile/GameHistory";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function Profile() {
    const theme = useTheme();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return <>
        <Head>
            <title>Profile</title>
            <meta name="description" content="Generated by create next app"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>
        <main>
            <Header/>
            <div className="container mx-auto mt-10">
                <Box>
                    <AppBar sx={{backgroundColor: "transparent"}} position="static">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                            sx={{backgroundColor: "transparent"}}
                        >
                            <Tab label="Settings" {...a11yProps(0)} />
                            <Tab label="Game History" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <Settings/>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <GameHistory/>
                    </TabPanel>
                </Box>
            </div>
        </main>
    </>
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx)
    if (!session) {
        ctx.res.writeHead(302, {Location: '/login'});
        ctx.res.end();
    }
    return {
        props: {
            session
        }
    }
}
