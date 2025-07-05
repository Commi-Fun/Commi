import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@mui/material";

export const LoginButton = () => {
  const { login } = usePrivy();

  return (
    <Button variant="contained" color="primary" onClick={login}>
      Connect Wallet
    </Button>
  );
};