import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import LeaderTable from "@/dashboard/detailComponents/LeaderTable";
import LeaderIndividual from "@/dashboard/detailComponents/LeaderIndividual";
import RedoIcon from "@/components/icons/RedoIcon";
import { customColors } from "@/shared-theme/themePrimitives";
import { Grid } from "@mui/material";

const LeaderBoards = () => {
  return (
    <Stack width={"100%"} sx={{ mt: 3 }}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        px={"0.75rem"}
      >
        <Typography variant="h1" fontSize={24}>
          Leaderboards
        </Typography>
        <Stack direction={"row"} alignItems={"center"} mt={2}>
          <RedoIcon />
          <Typography
            fontSize={"1rem"}
            variant="subtitle1"
            color={customColors.main.Green01}
            mr={3}
            pl={"1px"}
          >
            Refresh
          </Typography>
          <Typography
            color={customColors.blue[300]}
            fontSize={"0.875rem"}
            pr={1}
          >
            Auto refresh every 30 minutes
          </Typography>
          <AccessAlarmIcon />
          <Typography pl={0.5} fontSize={"0.875rem"}>
            Next in 28:03
          </Typography>
        </Stack>
      </Stack>
      <Stack direction={"row"} mt={2}>
        <LeaderTable></LeaderTable>
        <Grid  container spacing={1} columns={10} sx={{flexGrow: 1}}>
          <Grid size={5}>
            <LeaderIndividual level={1} />
          </Grid>
          <Grid size={3}>
            {/* <LeaderIndividual level={1} /> */}
          </Grid>
          <Grid size={2}>
            {/* <LeaderIndividual level={1} /> */}
          </Grid>
          {/* <Grid size={4}>
            <Item>size=4</Item>
          </Grid>
          <Grid size={4}>
            <Item>size=4</Item>
          </Grid>
          <Grid size={8}>
            <Item>size=8</Item>
          </Grid> */}
        </Grid>
        {/* <Stack direction={"row"} gap={1}>
          {Array.from({ length: 3 }).map((_, i) => (
            <LeaderIndividual level={1} key={i} />
          ))}
        </Stack> */}
      </Stack>
    </Stack>
  );
};

export default LeaderBoards;
