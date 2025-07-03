import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LeaderTable from "@/dashboard/detailComponents/LeaderTable";
import LeaderIndividual from "@/dashboard/detailComponents/LeaderIndividual";

const LeaderBoards = () => {
    return <Stack width={'100%'} sx={{mt: 3}}>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography>Leaderboards</Typography>
            <Stack direction={'row'} alignItems={'center'} mt={2}>
                <RefreshIcon/>
                <Typography>
                    {`{X}`} mins refresh:
                </Typography>
                <Typography>
                    28:03
                </Typography>
                <AccessAlarmIcon/>
            </Stack>
        </Stack>
        <Stack direction={'row'} gap={3} mt={2}>
            <LeaderTable></LeaderTable>
            <Stack direction={'row'} gap={1}>
                {
                    Array.from({length: 3}).map((_, i) => (<LeaderIndividual key={i} />))
                }
            </Stack>
        </Stack>
    </Stack>
}

export default LeaderBoards