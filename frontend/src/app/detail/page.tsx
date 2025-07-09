'use client';
import DetailHeader from "@/dashboard/detailComponents/DetailHeader";
import Box from "@mui/material/Box";
import LatestRunningCampaign from "@/dashboard/detailComponents/LatestRunningCampaign";
import LeaderBoards from "@/dashboard/detailComponents/LeaderBoards";
const Detail = () => {
    return <Box width={'100%'} sx={{ px: 3.75 }}>
        <DetailHeader />
        <LatestRunningCampaign />
        <LeaderBoards />
    </Box>
}

export default Detail