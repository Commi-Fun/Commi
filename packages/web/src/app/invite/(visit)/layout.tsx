import AppTheme from '@/shared-theme/AppTheme';

import React from 'react';
import { Header } from '../components/Header';
import Image from 'next/image';

export const metadata = {
  title: 'You are invited!',
  description: 'A special invitation.',
};

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center gap-3 pt-10 pl-20">
        <Image
          src={'/inviteLogo.png'}
          width={317.67}
          height={119}
          alt="Commi Logo"
          quality={100}
          priority
          className="object-contain"
        />
      </div>
      {/* Layer 1: 右下角圆形背景 - 最底层 */}
      <div className="absolute -bottom-52 -right-31.75 w-244 h-244 bg-green01-900 rounded-full z-10 "></div>

      {/* <div className="fixed inset-0 pointer-events-none z-20">
          <div className="absolute top-20 right-20 w-16 h-16 bg-blue-400 rounded-full shadow-lg animate-float"></div>
          <div className="absolute top-32 right-32 w-20 h-20 bg-orange-400 rounded-full shadow-lg animate-pulse-slow"></div>
          <div className="absolute top-48 right-16 w-14 h-14 bg-yellow-400 rounded-full shadow-lg"></div>

          <div className="absolute top-64 right-40 w-12 h-12 bg-green-600 rounded-full shadow-lg animate-float"></div>
          <div className="absolute top-80 right-24 w-18 h-18 bg-purple-400 rounded-full shadow-lg"></div>

          <div className="absolute bottom-32 right-8 w-16 h-16 bg-blue-500 rounded-full shadow-lg animate-pulse-slow"></div>
          <div className="absolute bottom-48 left-1/2 w-20 h-20 bg-pink-400 rounded-full shadow-lg animate-float"></div>
          <div className="absolute bottom-64 right-1/3 w-14 h-14 bg-orange-300 rounded-full shadow-lg"></div>

          <div className="absolute top-1/3 left-10 w-12 h-12 bg-cyan-400 rounded-full shadow-lg animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-32 w-16 h-16 bg-rose-400 rounded-full shadow-lg animate-float"></div>
        </div> */}

      {/* Layer 3: 大型 Logo 背景 - 最高层背景元素 */}
      <div className="absolute bottom-0 right-40 z-30 pointer-events-none">
        <Image src={'/images/commiCup.png'} alt="" width={400} height={680} />
      </div>

      {children}
    </>
  );
}
