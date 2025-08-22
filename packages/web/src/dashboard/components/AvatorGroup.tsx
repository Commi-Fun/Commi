import Image from 'next/image'

export const AvatorGroup = ({ members }: { members: { src: string }[] }) => {
  return (
    <div className="flex">
      {members.slice(0, 3).map((member, index) => (
        <Image
          key={index}
          src={member.src}
          alt={`Member ${index + 1}`}
          width={24}
          height={24}
          className={`rounded-full border-2 border-white ${index > 0 ? '-ml-2' : ''}`}
          onError={e => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=User${index}&background=random`
          }}
        />
      ))}
    </div>
  )
}
