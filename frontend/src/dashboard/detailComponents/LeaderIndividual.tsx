import Card from "@mui/material/Card";

interface Props {
  level: 1;
}

const LeaderIndividual = ({}: Props) => {
  return (
    <Card
      sx={{
        // border: "4px solid #fff",
        background: "linear-gradient(to bottom, #000000 0%, #1c241b 100%)",
        paddingTop: "50%",
        // ...widthAndHeight
      }}
    >
      {/* <Stack direction={"row"}>
        <Typography>#01</Typography>
        <Avatar />
        <Typography>Beta-Q</Typography>
        <Typography>@Beta</Typography>
      </Stack>
      <Stack>
        <Typography>1123</Typography>
        <Typography>{`{Meme Name}`}</Typography>
        <Typography>2.66%</Typography>
      </Stack> */}
    </Card>
  );
};

export default LeaderIndividual;
