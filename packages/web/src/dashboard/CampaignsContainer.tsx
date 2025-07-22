"use client";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CampaignCard from "@/dashboard/components/CampaignCard";
import Grid from "@mui/material/Grid";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const mockCampaignData = Array.from({length: 4}).map(() => ({
    address: "EFMFaSsdgsdgewerwreump",
    members: [
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Rf0ukJKUzQ28IPO8kqlkHXOpvB-OQl3f6Q&s",
        },
        {
            src: "",
        },
        {
            src: "https://i.namu.wiki/i/V2fxixCG-QESg0yhz_XC7zDn140e8r9GvUiwcM-5N2m24nDwDk0oqMHYEj0zslW3u5Yim1qgPmCB1DeChNclKg.webp",
        },
    ],
}));

const CampaignsContainer = () => {
    const [value, setValue] = React.useState("one");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <Box>
            <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
                sx={{mt: 3, mb: 0}}
                justifyContent={"space-between"}
            >
                <Typography component="h2" variant="h6">
                    Campaign
                </Typography>
                <Tabs value={value} onChange={handleChange}>
                    <Tab value="one" label="All"/>
                    <Tab value="two" label="Category1"/>
                    <Tab value="three" label="Category2"/>
                </Tabs>
            </Stack>
            <Stack direction={'row'} gap={2.9} flexWrap={'wrap'} mt={3}>
                {mockCampaignData.map((card, index) => (
                    <Grid size={2} key={index}>
                        <CampaignCard key={index} {...card}></CampaignCard>
                    </Grid>
                ))}
            </Stack>
        </Box>
    );
};

export default CampaignsContainer;
