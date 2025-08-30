'use client'

import React, { useContext } from 'react'
import { Divider } from '@mui/material'
import { WalletAddress } from '@/dashboard/components/WalletAddress'
import { ArrowCircleRight } from './icons/ArrowCircleRight'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { dummyAddedCampaign } from '@/lib/constants'
import { GlobalContext } from '@/context/GlobalContext'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token'
import { useForm } from '@tanstack/react-form'
import { useCreateCampaignMutation } from '@/query/query'
import { CampaignCreateRequest } from '@/types/campaign'
import { useSession } from 'next-auth/react'
const tokenList = [
  {
    tokenAddress: 'x0012344',
    tokenName: 'Cup',
  },
  {
    tokenAddress: 'x0012344',
    tokenName: 'Superteam Degens',
  },
  {
    tokenAddress: 'x0012344',
    tokenName: 'Bali Ape Boom',
  },
  {
    tokenAddress: 'x0012344',
    tokenName: 'xBonk',
  },
]

interface CreateCampaignFormProps {
  onClose: () => void
}

export function CreateCampaignForm({ onClose }: CreateCampaignFormProps) {
  const { publicKey, sendTransaction } = useWallet()
  const { setCampaigns } = useContext(GlobalContext)
  const { connection } = useConnection()
  const createCampaignMutation = useCreateCampaignMutation()

  const { data: session } = useSession()

  const form = useForm({
    defaultValues: {
      tokenAddress: '',
      tokenName: '',
      totalAmount: '',
      duration: 0,
      rewardRound: 0,
      description: '',
      socialLinks: '',
      twitterLink: '',
    },
    onSubmit: async ({ value }) => {
      await handleCreateCampaign(value)
    },
  })

  const sendTrans = async (totalAmount: string) => {
    if (!publicKey) {
      return
    }
    try {
      // 1. 将地址字符串转换为 PublicKey 对象
      const recipientPubKey = new PublicKey('7GF8EZRresw2QH26XLSvc5WK9mEwEqho55PEbHc1MwPM')
      const mintPubKey = new PublicKey('9jK7su8LmSi3DUcKZfYJYdvycUkvRQa1EokcusNkpump')

      // 注意：代币数量需要处理精度。这里假设代币有 6 位小数
      // 在真实应用中，你应该先查询 mint 地址来获取实际的精度
      const tokenDecimals = 6
      const amountInSmallestUnit = parseFloat(totalAmount) * Math.pow(10, tokenDecimals)

      // 2. 找到发送者和接收者的关联代币账户 (ATA)
      // 发送者的 ATA
      const fromAta = await getAssociatedTokenAddress(mintPubKey, publicKey)
      // 接收者的 ATA
      const toAta = await getAssociatedTokenAddress(mintPubKey, recipientPubKey)

      // 3. 创建一个新的交易
      const transaction = new Transaction()

      // 4. 创建转账指令
      // 这是一个核心步骤，它描述了要执行的操作
      const transferInstruction = createTransferInstruction(
        fromAta, // 从哪个账户转出
        toAta, // 转入哪个账户
        publicKey, // 谁是所有者 (签名者)
        amountInSmallestUnit, // 转账数量 (最小单位)
      )

      // 5. 将指令添加到交易中
      transaction.add(transferInstruction)

      // 6. 使用 wallet-adapter 的 sendTransaction 方法发送交易
      // 它会自动处理 blockhash 和签名流程
      const txSignature = await sendTransaction(transaction, connection)

      // 7. (可选) 等待交易确认
      await connection.confirmTransaction(txSignature, 'processed')

      return txSignature
    } catch (err) {
      console.log('transaction error', err)
      throw err
    }
  }

  const handleCreateCampaign = async (formData: any) => {
    try {
      // Send transaction first
      // const txSignature = await sendTrans(formData.totalAmount)
      const txSignature = '123456'

      // Prepare campaign data
      const campaignData: CampaignCreateRequest = {
        description: formData.description,
        tokenAddress: formData.tokenAddress,
        tokenName: formData.tokenName,
        ticker: formData.tokenName, // Using tokenName as ticker for now
        totalAmount: formData.totalAmount,
        startTime: new Date(),
        endTime: new Date(Date.now() + formData.duration * 60 * 60 * 1000), // duration in hours
        duration: formData.duration,
        rewardRound: formData.rewardRound,
        tags: [],
        socialLinks: {
          xCommunityLink: formData.socialLinks,
          xLink: formData.twitterLink,
        },
        creatorId: session?.user.userId || 0, // TODO: Get actual user ID
        txHash: txSignature,
      }

      // Create campaign using mutation
      await createCampaignMutation.mutateAsync(campaignData)

      // Update local state for immediate UI feedback
      setCampaigns((prev: any) => [dummyAddedCampaign, ...prev])

      onClose()
    } catch (e) {
      console.error('Failed to create campaign:', e)
    }
  }

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      console.log('Copied to clipboard:', text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col h-fit bg-white">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[28px] font-extrabold text-black">Create Campaign</h2>
      </div>
      {/* Wallet Address */}

      <div className="flex gap-4 items-center">
        <label className="block text-[16px] font-semibold text-black">Wallet Address</label>
        {publicKey && <WalletAddress address={publicKey?.toBase58()} showIcon />}
      </div>
      <Divider className="!border-gray-200 !mt-6" />
      {/* Content */}
      <div className="flex-1 grid grid-cols-2 gap-12 py-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Select Token */}
          <form.Field
            name="tokenAddress"
            validators={{
              onChange: ({ value }) => (!value ? 'Token selection is required' : undefined),
            }}
            children={field => (
              <div>
                <label className="block text-[16px] font-semibold text-black mb-3">
                  <span className="text-green-500 mr-1">*</span>Select Token
                </label>
                <div className="relative">
                  <select
                    value={field.state.value}
                    onChange={e => {
                      const selected = tokenList.find(item => item.tokenAddress === e.target.value)
                      if (selected) {
                        field.handleChange(selected.tokenAddress)
                        form.setFieldValue('tokenName', selected.tokenName)
                      }
                    }}
                    className={`w-full p-4 border rounded-lg outline-0 appearance-none bg-white text-[14px] cursor-pointer ${
                      field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                    }`}>
                    <option value="" className="text-gray-400">
                      Select tokenAddress
                    </option>
                    {tokenList.map(token => (
                      <option key={token.tokenAddress} value={token.tokenAddress}>
                        {token.tokenName}
                      </option>
                    ))}
                  </select>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />

          {/* Token Amount */}
          <form.Field
            name="totalAmount"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Token amount is required'
                if (Number(value) <= 0) return 'Token amount must be greater than 0'
                return undefined
              },
            }}
            children={field => (
              <div>
                <label className="block text-[16px] font-semibold text-black mb-3">
                  <span className="text-green-500 mr-1">*</span>Token Amount
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    className={`flex-1 p-4 border rounded-lg text-[16px] outline-0 ${
                      field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />

          {/* Campaign Duration and Reward Rounds */}
          <div>
            <label className="block text-[16px] font-semibold text-black mb-1">
              <span className="text-green-500 mr-1">*</span>Campaign Duration
            </label>
            <p className="text-[12px] text-gray-500 mb-3">Starts immediately upon creation</p>

            <div className="grid grid-cols-2 gap-4">
              {/* Campaign Duration Field */}
              <form.Field
                name="duration"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || value <= 0) return 'Campaign duration is required'
                    return undefined
                  },
                }}
                children={field => (
                  <div>
                    <div className="relative">
                      <select
                        value={field.state.value}
                        onChange={e => field.handleChange(Number(e.target.value))}
                        className={`w-full p-4 border rounded-lg outline-0 appearance-none bg-white text-[14px] cursor-pointer ${
                          field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                        }`}>
                        <option value="" className="text-gray-400">
                          Select Activity Time
                        </option>
                        <option value="1">1 Hour</option>
                        <option value="6">6 Hours</option>
                        <option value="12">12 Hours</option>
                        <option value="24">24 Hours</option>
                        <option value={3 * 24}>3 Days</option>
                        <option value={7 * 24}>7 Days</option>
                        <option value={30 * 24}>30 Days</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              />

              {/* Reward Rounds Field */}
              <form.Field
                name="rewardRound"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || value === 0) {
                      return 'Please select reward rounds'
                    }
                    return undefined
                  },
                }}
                children={field => (
                  <div>
                    <div className="relative">
                      <select
                        value={field.state.value}
                        onChange={e => field.handleChange(Number(e.target.value))}
                        className={`w-full p-4 border rounded-lg outline-0 appearance-none bg-white text-[14px] cursor-pointer ${
                          field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                        }`}>
                        <option value="" className="text-gray-400">
                          Select Reward Rounds
                        </option>
                        <option value="6">6 Hours</option>
                        <option value="12">12 Hours</option>
                        <option value="48">48 Hours</option>
                        <option value="72">72 Hours</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Description */}
          <form.Field
            name="description"
            children={field => (
              <div>
                <label className="block text-[16px] font-semibold text-black mb-3">
                  Description
                </label>
                <textarea
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="Briefly describe the purpose and benefits of this campaign."
                  className="w-full h-30 p-4 border rounded-lg border-gray-300 outline-0 placeholder-gray-400 bg-gray-50"
                />
              </div>
            )}
          />

          {/* Community Link */}
          <form.Field
            name="socialLinks"
            children={field => (
              <div>
                <label className="block text-[16px] font-semibold text-black mb-3">
                  X Community Link
                </label>
                <input
                  type="url"
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="Enter your community link ( Telegram / Discord / Forum URL )"
                  className="w-full p-4 border border-gray-300 rounded-lg outline-0 text-[14px] placeholder-gray-400 bg-gray-50"
                />
              </div>
            )}
          />

          {/* Twitter Link */}
          <form.Field
            name="twitterLink"
            children={field => (
              <div>
                <label className="block text-[16px] font-semibold text-black mb-3">X link</label>
                <input
                  type="url"
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="Enter your Twitter link"
                  className="w-full p-4 border border-gray-300 rounded-lg outline-0 focus:border-transparent text-[14px] placeholder-gray-400 bg-gray-50"
                />
              </div>
            )}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-8 border-t border-gray-200">
        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || createCampaignMutation.isPending}
              className="group cursor-pointer bg-main-Black disabled:bg-gray-400 px-6 py-[10.5px] rounded-lg flex items-center gap-2">
              <span className="text-[18px] font-bold text-lime-300 group-disabled:text-white">
                {isSubmitting || createCampaignMutation.isPending
                  ? 'Creating...'
                  : 'Create Campaign'}
              </span>
              <ArrowCircleRight className="text-lime-300 text-[24px] group-disabled:text-white" />
            </button>
          )}
        />
      </div>
    </form>
  )
}
