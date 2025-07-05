import MainGrid from "@/dashboard/components/MainGrid";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Commi",
    icons: {
        icon: "/logo.svg",
    },
};

const Page = () => {

    return <MainGrid/>
};

export default Page;
