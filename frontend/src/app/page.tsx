import MainGrid from "@/dashboard/components/MainGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commi",
  icons: {
    icon: "/logo.svg",
  },
};

const Page = () => {
  return (
    <>
      {/* <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      > */}
      {/* <UserProfile /> */}
      {/* <LoginButton /> */}
      {/* </Box> */}
      <MainGrid />
    </>
  );
};

export default Page;
