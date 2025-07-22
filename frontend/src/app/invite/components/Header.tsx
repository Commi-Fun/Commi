import Image from 'next/image'

export const Header = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-12">
        <Image
          src={'/inviteLogo.png'}
          width={318}
          height={120}
          alt="Commi Logo"
          quality={100}
          priority
          className="object-contain"
        />
      </div>
    </div>
  )
}
