import {customColors} from "@/shared-theme/themePrimitives";
import Paper from '@mui/material/Paper';
import Stack from "@mui/material/Stack";
import * as React from "react";

const LatestRunningCampaign = () => {
    return <Paper sx={{backgroundColor: customColors.main.Black, py: 2, px: 1, mt: 2}}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} style={{height: '200px', border: '1px dashed #d9d9d9'}}>
            {/* <Stack direction={'row'}>
                <Typography>正在发放奖励 {`{X}`} 个活跃池</Typography>
                <Typography>
                    倒计时：2025/2/24 08:08 - 2025/08/08 08:08
                </Typography>
            </Stack> */}
            {/* <Button variant={'outlined'} startIcon={<AddIcon/>}>Add pool</Button> */}
        </Stack>

    </Paper>
}

export default LatestRunningCampaign