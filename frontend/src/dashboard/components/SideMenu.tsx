"use client"
import * as React from 'react';
import {styled} from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, {drawerClasses} from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';
import JoinedCampaignList from './JoinedCampainList';
import Chip from "@mui/material/Chip";
import {customColors} from "@/shared-theme/themePrimitives";
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

export default function SideMenu() {
    return (
        <Box
            sx={{
                display: {xs: 'none', md: 'block'},
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: customColors.main["400"],
                },
            }}
        >

            <Stack direction={'row'} alignItems={'end'} gap={1} paddingX={2.5} py={3}>
                <Typography sx={{fontSize: '1rem', fontWeight: 'bold', mb: '-0.25rem'}}>
                    Commi
                </Typography>
                <div style={{
                    color: '#000000',
                    background: 'linear-gradient(to right, #024634 0%, #d0f685 50%, #d0f685 100%)',
                    height: '1.25rem',
                    lineHeight: '1.25rem',
                    padding: '2px 4px',
                    fontWeight: 'bold',
                    borderRadius: '2px'
                }}>
                    MVP
                </div>
            </Stack>
            <Stack
                direction="row"
                sx={{
                    gap: 1,
                    alignItems: 'center',
                    mt: 3,
                    position: 'relative'
                }}
                paddingX={2}
            >
                <Avatar
                    alt="Riley Carter"
                    src="https://images.steamusercontent.com/ugc/1637611602253477558/8D6958D1C1CF006D6D461206E0059C1FD4D00B2A/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
                    sx={{width: 50, height: 50, border: '1px solid #fff'}}
                />
                <Box sx={{mr: 'auto'}}>
                    <Typography variant="body2" sx={{fontWeight: 500, lineHeight: '16px'}}>
                        Riley Carter
                    </Typography>
                    <Typography variant="caption" sx={{color: 'text.secondary'}}>
                        riley@email.com
                    </Typography>
                </Box>
                <SettingsIcon fontSize={'small'} sx={{position: 'absolute', top: '6px', right: '16px', color: 'gray'}}/>
            </Stack>

            <Box
                sx={{
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    mt: 2
                }}
            >
                <MenuContent/>
            </Box>
            <Divider/>
            <Box
                sx={{
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <JoinedCampaignList/>
            </Box>
        </Box>
    );
}
