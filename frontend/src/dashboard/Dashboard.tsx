import * as React from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import Divider from "@mui/material/Divider";
import {customColors} from "@/shared-theme/themePrimitives";

const xThemeComponents = {};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
    return (
        <AppTheme {...props} themeComponents={xThemeComponents}>
            <CssBaseline/>
            <Box sx={{display: 'flex', backgroundColor: customColors.main.Green01, height: '100vh'}}>
                <SideMenu/>
                <AppNavbar/>
                <Box
                    component="main"
                    sx={() => ({
                        flexGrow: 1,
                        overflow: 'auto',
                    })}
                >

                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            mx: 3,
                            pb: 5,
                            mt: {xs: 8, md: 0},
                        }}
                    >
                        <Header/>
                        <Divider sx={{width: '100%'}}/>
                        <MainGrid/>
                    </Stack>

                </Box>
            </Box>
        </AppTheme>
    );
}
