import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

const LeaderIndividual = () => {
    return <Card
        sx={{border: '1px solid #fff', width: '200px',p: 2, background: 'linear-gradient(to bottom, #000000 0%, #1c241b 100%)'}}>
        <Stack direction={'row'}>
            <Typography>#01</Typography>
            <Avatar />
            <Typography>Beta-Q</Typography>
            <Typography>@Beta</Typography>
        </Stack>
        <Stack>
            <Typography>
                1123
            </Typography>
            <Typography>
                {`{Meme Name}`}
            </Typography>
            <Typography>
                2.66%
            </Typography>
        </Stack>
    </Card>
}

export default LeaderIndividual;