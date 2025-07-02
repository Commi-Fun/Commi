import DashboardLayout from "@/dashboard/DashboardLayout";
import React from "react";
import {PrivyClient} from "@/lib/privyClient";

// import { Nunito_Sans } from 'next/font/google';

// const nunitoSans = Nunito_Sans({
//   weight: ['400', '600', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// })
//
// const ff = nunitoSans.className

type MyComponentProps = React.PropsWithChildren<{
  title: string;
}>;

const Layout: React.FC<MyComponentProps> = ({ children }) => {
  return (
    <html>
      <body className={'font-sans'}>
        <PrivyClient>
            <DashboardLayout>{children}</DashboardLayout>
        </PrivyClient>
      </body>
    </html>
  );
};

export default Layout;
