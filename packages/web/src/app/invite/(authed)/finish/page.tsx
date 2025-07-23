import CopyIcon from '@/components/icons/CopyIcon'

const Page = () => {
  return (
    <div className="w-225 absolute top-50 right-22.5">
      <p className="text-[72px] text-main-Black font-extrabold font-shadow-white">BOOST YOUR</p>
      <p className="text-[#fbff00] text-[72px] font-extrabold font-shadow-black">AIRDROP REWARDS</p>

      <div className="border-black border-2 border-solid rounded-4xl py-6 bg-white px-10 shadow-[6px_6px_0_#000000] text-2xl font-extrabold">
        <p>Invite friends and earn 20% of their Beta points </p>
        <p>— the more you invite, the bigger your future airdrop.</p>
      </div>

      <div className="flex justify-between items-center mt-20">
        <span className="font-bold text-main-Black text-[1.125rem]">Copy Invite Link</span>
        <CopyIcon className="text-green01-200 cursor-pointer" />
      </div>
      <div className="mt-4 bg-green01-800 p-6 rounded-2xl text-[1.125rem]">
        🧃Airdrop season’s coming. I’m in Commi @commidotfun early — whitelist now or regret
        later:...
      </div>

      <p className="text-right mt-4 font-semibold">X friends joined🧃</p>
    </div>
  )
}

export default Page
