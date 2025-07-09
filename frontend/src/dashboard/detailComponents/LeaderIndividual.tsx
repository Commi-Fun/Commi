import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

interface Props {
  level: 1;
}

const LeaderIndividual = ({ level }: Props) => {

  const widthAndHeight: { width: string; height: string } = { width: "50px", height: "50px" };

//   if (level === 1) {
//     widthAndHeight.width = "388px";
//     widthAndHeight.height = "321px";
//   }

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
