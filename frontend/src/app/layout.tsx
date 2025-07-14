import DashboardLayout from "@/dashboard/DashboardLayout";
import React from "react";
import { Web3Provider } from "@/components/Web3Provider";
import { NextAuthProvider } from "@/components/NextAuthProvider";

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
        <Web3Provider>
          <NextAuthProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </NextAuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
};

export default Layout;
