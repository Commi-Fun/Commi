"use client";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "@/dashboard/components/AppNavbar";
import Header from "@/dashboard/components/Header";
import SideMenu from "@/dashboard/components/SideMenu";
import AppTheme from "@/shared-theme/AppTheme";
import Divider from "@mui/material/Divider";
import {customColors} from "@/shared-theme/themePrimitives";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Dashboard - My Campaigns",
    icons: {
        icon: "/logo.svg",
    },
};

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    // const {ready, authenticated, login} = usePrivy();
    //
    // useEffect(() => {
    //     if (ready && !authenticated) {
    //         login();
    //     }
    // }, [ready, authenticated]);
    //
    // if (!ready || !authenticated) {
    //     return null;
    // }

    return (
        <AppTheme>
            <CssBaseline/>
            <Box
                sx={{
                    display: "flex",
                    backgroundColor: customColors.main.Black,
                    height: "100vh",
                }}
            >
                <SideMenu/>
                <AppNavbar/>
                <Box
                    component="main"
                    sx={() => ({
                        flexGrow: 1,
                        overflow: "auto",
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: "center",
                            pb: 5,
                            mt: {xs: 8, md: 0},
                        }}
                    >
                        <Header/>
                        <Divider sx={{width: "100%"}} style={{marginTop: '10px'}}/>
                        {children}
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
}
