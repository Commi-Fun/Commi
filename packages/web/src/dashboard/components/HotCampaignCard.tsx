import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'

export const HotCampaignCard = ({
  imgSrc,
  tokenName,
}: {
  imgSrc: string
  tokenName: string
  tokenAddress: string
}) => {
  return (
    <div className="flex flex-col items-center border-2 border-black rounded-[20px] p-6 min-w-45 bg-main-White">
      <div className="w-60 h-60 rounded-lg flex items-center justify-center">
        <img src={imgSrc} alt="" width={240} height={240} />
      </div>
      <div className="flex mt-6 items-center justify-between w-full">
        <span className="font-extrabold text-[24px]">{tokenName}</span>
        <ArrowCircleRight className="text-main-Green01 bg-main-Black rounded-full text-[30px]" />
      </div>
    </div>
  )
}
