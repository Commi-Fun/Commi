import Dashboard from "@/dashboard/Dashboard";
import MainGrid from "@/dashboard/components/MainGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - My Campaigns",
  icons: {
    icon: "/logo.svg",
  },
};

const Page = () => {
  return <MainGrid />;
};

export default Page;
