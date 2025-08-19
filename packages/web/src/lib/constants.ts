export const REFERRAL_CODE_SEARCH_PARAM = 'referralCode'
export const copyText = `Juice early. Juice loud. Juice for real.

@commidotfun connects memes, communities, and rewards — in real-time.

I'm in the Commi beta — whitelist claimed, rewards loading... 🍹

Start juicing 👉 `
export const url_prefix = process.env.NEXT_PUBLIC_BASE_URL || 'https://commi.fun'

export const dummyCampaigns: any = [
  {
    name: 'Commi Cup Catfight',
    address: 'dLwtEzPY2vdBunYyN3s86EZgcAjy28gVpump',
    MCap: '$9233K',
    price: '$0.0009233874',
    poolSize: 2100,
    poolValue: '$131,217',
    startDate: '20/5/2024 08:00',
    endDate: '',
    endingIn: '4D : 10H',
    totalAmount: 10000000000,
    members: [
      { imgUrl: 'https://i.pinimg.com/736x/ed/d7/8c/edd78c3a67d600902cad7af42173424a.jpg' },
      { imgUrl: 'https://i.pinimg.com/736x/50/82/ee/5082eeb7f21bd3938b9270ee50643bd1.jpg' },
      {
        imgUrl:
          'https://img.freepik.com/premium-vector/matcha-cupcake-vector-isolated-white-background-cupcake-cartoon-illustration_338371-964.jpg?w=360',
      },
      {
        imgUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQlQ8Zw1TtK5s2ZS6A1T92raqT3m5g_OImRA&s',
      },
    ],
    description:
      'A chaotic showdown between Commi clans. Only one team can win the meme cup of the season.',
    createdBy: 'anon_catdao',
    remainingCount: '',
    takenAmount: 2010,
    imgUrl:
      'https://previews.123rf.com/images/admindou/admindou2405/admindou240500278/229185709-this-delightful-illustration-features-an-animated-green-bubble-tea-character-complete-with-a-joyful.jpg',
  },
  {
    name: 'Superteam Degens',
    imgUrl: 'https://pbs.twimg.com/profile_images/1902372646249234432/T4kNyTq0_400x400.jpg',
    address: 'bG2cdupj7NhXP8xwoPdWmoGQAiiGtZb5bonk',
    MCap: '$9452K',
    price: '$0.0009452079',
    poolSize: 8342,
    poolValue: '$258,555',
    startDate: '20/5/2024 08:00',
    endDate: '',
    endingIn: '1D : 19H',
    totalAmount: 10000000000,
    members: [
      {
        imgUrl:
          'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/event-covers/t1/76ef8f72-919a-459d-bc3b-f6d956cc4327.png',
      },
      {
        imgUrl:
          'https://static.vecteezy.com/system/resources/previews/018/751/828/non_2x/indonesian-flag-icon-round-free-vector.jpg',
      },
      {
        imgUrl:
          'https://www.shutterstock.com/image-vector/bali-travel-logo-vector-eps-600nw-2280114393.jpg',
      },
    ],
    description: 'Superteam decided to go full degen and launch their own meme war.',
    createdBy: 'superanon123',
    remainingCount: '',
    takenAmount: 4000,
  },
  {
    imgUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5hIb3L6RWGO67CP6woHrXlBETkhu8nUocrg&s',
    name: 'Bali Ape Boom',
    address: 'vMTkFFuDTRULJinTVxc5Wp51kdqfbhajbonk',
    MCap: '$4142K',
    price: '$0.0004142390',
    poolSize: 342,
    poolValue: '$78,847',
    startDate: '20/5/2024 08:00',
    endDate: '',
    endingIn: '1D : 16H',
    totalAmount: 10000000000,
    members: [
      {
        imgUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvNxKB4mKmBe0R3e-AA7xIPU4FNrxAXgdO5Q&s',
      },
    ],
    description: 'Tropical apes from Bali enter the meme arena, surfing charts and coconuts.',
    createdBy: 'mangroov3.eth',
    remainingCount: '',
    takenAmount: 21,
  },
  {
    name: 'xBonk',
    address: 'dLwtEzPY2vdBunYyN3s86EZgcAjy28gVbonk',
    MCap: '$7456K',
    price: '$0.000923',
    poolSize: 32123,
    poolValue: '$131217',
    startDate: '2024-08-19T08:00:00Z',
    endDate: '2024-08-31T08:00:00Z',
    endingIn: '12D : 00H',
    totalAmount: 10000000000,
    imgUrl: 'https://letsbonk.chat/lbcr.png',
    members: [
      {
        imgUrl:
          'https://s3.coinmarketcap.com/static-gravity/image/a28128d9ff7c49c9ad33ee2f626fda40.png',
      },
      {
        imgUrl: 'https://i.pinimg.com/564x/d9/56/9b/d9569bbed4393e2ceb1af7ba64fdf86a.jpg',
      },
      {
        imgUrl: 'https://blog.arnaudknobloch.com/wp-content/uploads/nft_pfp_01.jpg',
      },
    ],
    description:
      'A new meme challenge powered by Bonk x Commi — pushing long-tail projects to the spotlight through playful collaboration.',
    createdBy: 'anon_juicygoose',
    takenAmount: 2321,
  },
]

export const joinedCampaigns = [dummyCampaigns[0]]

export const dummyAddedCampaign: any = {
  name: 'heihei',
  address: '',
  imgUrl: 'https://pbs.twimg.com/profile_images/1956639049609097216/IKoWF2hl_normal.jpg',
  tokenAmount: 0,
  duraion: 6,
  description: '',
  communityLink: '',
  twitterLink: '',
  poolSize: 999,
  MCap: '100K',
  price: '222',
}

export const dummyLeaders: any = [
  {
    name: 'SuperSad',
    handle: 'super_eth',
    airdrop: 112,
    score: 98,
    imgUrl: 'https://pbs.twimg.com/profile_images/1956639049609097216/IKoWF2hl_normal.jpg',
    rank: 1,
    rewards: 888,
  },
]

export const dummyTokenList = [
  {
    tokenAddress: 'x0012344',
    tokenName: 'PEPE',
  },
]
