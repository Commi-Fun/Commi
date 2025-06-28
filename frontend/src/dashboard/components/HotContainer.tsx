import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CampaignCard from "@/dashboard/components/CampaignCard";
import Grid from "@mui/material/Grid";
import * as React from "react";

const mockData = Array.from({length: 3}).map(() => ({}))

const RoundIcon = () => {
    return <div style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d9d9d9'}}/>
}

const HotContainer = () => {
    return <Box>
        <Stack direction={'row'} alignItems={'center'} gap={1} sx={{mb: 2}}>
            <Typography component="h2" variant="h6">
                HOT
            </Typography>
            <LocalFireDepartmentIcon fontSize={'small'} sx={{color: 'var(--orange-100)'}}/>
        </Stack>
        <Stack direction={'row'} gap={1}>
            {
                mockData.map(() => <Chip avatar={<RoundIcon/>} sx={{pl: 1}} label={'OG'}></Chip>)
            }
        </Stack>
        <Grid
            container
            spacing={2}
            columns={12}
            sx={{mb: (theme) => theme.spacing(2), mt: 2}}
        >
            {Array.from({length: 4}).map((card, index) => (
                <CampaignCard key={index}>
                </CampaignCard>
            ))}
        </Grid>
    </Box>
}

export default HotContainer