import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import GroupIcon from "@mui/icons-material/Group";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { gray, customColors } from "@/shared-theme/themePrimitives";
import Button from "@mui/material/Button";
import IosShareIcon from "@mui/icons-material/IosShare";
function truncateMiddle(text: string): string {
  return text.slice(0, 5) + "..." + text.slice(-3);
}

interface Props {
  address: string;
  members: Record<string, string>[];
}

const CampaignCard = ({ address, members }: Props) => {

  return (
    <Card
      style={{
        backgroundColor: customColors.blue["1300"],
        position: "relative",
      }}
    >
      <IosShareIcon
        style={{
          cursor: "pointer",
          position: "absolute",
          top: 8,
          right: 8,
          fontSize: "1rem",
        }}
      />
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <Avatar
          variant={"rounded"}
          sx={{ width: "64px", height: "64px" }}
          src={
            "https://marketplace.canva.com/EAFltIh8PKg/1/0/1600w/canva-cute-anime-cartoon-illustration-girl-avatar-J7nVyTlhTAE.jpg"
          }
        />
        <Stack gap={1}>
          <Stack direction={"row"} alignItems={"center"} gap={0.5}>
            <Typography>Token name</Typography>
            <Avatar
              sx={{
                width: 16,
                height: 16,
              }}
              src={
                "data:image/jpeg;base64,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"
              }
            />
            <GroupIcon sx={{ fontSize: "1rem" }} />
            <Typography
              sx={{ color: customColors.main["Green01"], fontSize: "0.75rem" }}
            >
              1.0M
            </Typography>
            <Typography
              sx={{
                fontSize: "0.5rem",
                alignSelf: "end",
                marginBottom: "0.175rem",
              }}
            >
              / 1.5M
            </Typography>
          </Stack>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Typography
              sx={{ fontSize: "0.75rem", color: customColors.main["Green01"] }}
            >
              MCap $39.7M
            </Typography>
            {members.map((mem, index) => (
              <Avatar
                key={index}
                sx={{
                  width: "1rem",
                  height: "1rem",
                  ml: index === 0 ? 0 : "-0.75rem",
                }}
                src={mem.src}
              />
            ))}
            <Stack direction={"row"} gap={0.5}>
              <Typography
                sx={{ fontSize: "0.6rem", color: "gray", alignSelf: "end" }}
              >
                {truncateMiddle(address)}
              </Typography>
              <ContentCopyIcon
                sx={{
                  fontSize: "0.5rem",
                  cursor: "pointer",
                  alignSelf: "end",
                  color: gray[300],
                  mb: "0.25rem",
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack justifyContent={"end"} direction={"row"} sx={{ mt: 1 }} gap={1}>
        <Typography
          sx={{ color: customColors.main["Green01"], fontSize: "0.75rem" }}
        >
          {`{X}`} Members Joined
        </Typography>
        {members.map((mem, index) => (
          <Avatar
            key={index}
            sx={{
              width: "1rem",
              height: "1rem",
              ml: index === 0 ? 0 : "-0.75rem",
            }}
            src={mem.src}
          />
        ))}
      </Stack>

      <Button
        variant={"outlined"}
        sx={{
          height: "1.5rem",
          borderRadius: "0.75rem",
          mt: 1,
          borderColor: customColors.main["Green02"],
          color: customColors.main["Green02"],
          fontSize: "0.75rem",
        }}
        fullWidth
      >
        Earn now
      </Button>
    </Card>
  );
};

export default CampaignCard;
