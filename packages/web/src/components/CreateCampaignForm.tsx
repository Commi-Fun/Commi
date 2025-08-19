'use client'

import React, { useContext, useState } from 'react'
import { Divider } from '@mui/material'
import { WalletAddress } from '@/dashboard/components/WalletAddress'
import { ArrowCircleRight } from './icons/ArrowCircleRight'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { resolve } from 'path'
import { dummyAddedCampaign, dummyCampaigns } from '@/lib/constants'
import { GlobalContext } from '@/context/GlobalContext'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token'
const tokenList = [
  {
    tokenAddress: 'x0012344',
    tokenName: 'PEPE',
  },
]

interface CreateCampaignFormProps {
  onClose: () => void
}

export function CreateCampaignForm({ onClose }: CreateCampaignFormProps) {
  const [formData, setFormData] = useState({
    tokenAddress: '',
    tokenName: '',
    totalAmount: '0',
    description: '',
    socialLinks: '',
    twitterLink: '',
    duration: 0,
  })
  const { publicKey, sendTransaction } = useWallet()
  const { setCampaigns } = useContext(GlobalContext)
  const { connection } = useConnection()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // 验证必填字段
  const isFormValid = () => {
    return (
      formData.tokenAddress.trim() !== '' &&
      formData.tokenName.trim() !== '' &&
      formData.totalAmount !== '0' &&
      formData.totalAmount.trim() !== '' &&
      formData.duration > 0 &&
      formData.description.trim() !== '' &&
      formData.socialLinks.trim() !== '' &&
      formData.twitterLink.trim() !== ''
    )
  }

  const sendTrans = async () => {
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
      const amountInSmallestUnit = parseFloat(formData.totalAmount) * Math.pow(10, tokenDecimals)

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

      alert(`转账成功！交易签名: ${txSignature}`)
    } catch (err) {
    } finally {
    }
  }

  const handleCreateCampaign = async () => {
    try {
      // const result = await (
      //   await fetch('/api/campaign/create', {
      //     method: 'POST',
      //     body: JSON.stringify({
      //       ...formData,
      //       walletAddress: publicKey?.toBase58(),
      //     }),
      //   })
      // ).json()
      await sendTrans()
      await new Promise(resolve => {
        setTimeout(resolve, 2000)
      })
      setCampaigns((prev: any) => [...prev, dummyAddedCampaign])

      onClose()
    } catch (e) {
      console.error('Failed to create campaign:', e)
    }
    // TODO: Implement campaign creation logic
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
    <div className="flex flex-col h-fit bg-white">
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
          <div>
            <label className="block text-[16px] font-semibold text-black mb-3">
              <span className="text-green-500 mr-1">*</span>Select Token
            </label>
            <div className="relative">
              <select
                value={formData.tokenAddress}
                onChange={e => {
                  const selected = tokenList.find(item => item.tokenAddress === e.target.value)
                  if (selected) {
                    handleInputChange('tokenAddress', selected.tokenAddress)
                    handleInputChange('tokenName', selected.tokenName)
                  }
                }}
                className="w-full p-4 border border-gray-300 rounded-lg outline-0 appearance-none bg-white text-[14px] cursor-pointer">
                <option value="" className="text-gray-400">
                  Select tokenAddress
                </option>
                {tokenList.map(token => (
                  <option key={token.tokenAddress} value={token.tokenAddress}>
                    {token.tokenName}
                  </option>
                ))}
              </select>
              {/* <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-md text-[12px] font-medium hover:bg-gray-700 transition-colors">
                Select Token
              </button> */}
            </div>
          </div>

          {/* Token Amount */}
          <div>
            <label className="block text-[16px] font-semibold text-black mb-3">
              <span className="text-green-500 mr-1">*</span>Token Amount
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={formData.totalAmount}
                onChange={e => handleInputChange('totalAmount', e.target.value)}
                className="flex-1 p-4 border border-gray-300 rounded-lg text-[16px] outline-0"
                placeholder="0"
              />
              {/* <span className="text-[14px] text-gray-500 font-medium">$0.00</span>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-[12px] font-medium hover:bg-gray-300 transition-colors">
                MAX
              </button> */}
            </div>
          </div>

          {/* Campaign Duration */}
          <div>
            <label className="block text-[16px] font-semibold text-black mb-1">
              <span className="text-green-500 mr-1">*</span>Campaign Duration
            </label>
            <p className="text-[12px] text-gray-500 mb-3">Starts immediately upon creation</p>
            <div className="relative">
              <select
                value={formData.duration}
                onChange={e => handleInputChange('duration', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg outline-0 appearance-none bg-white text-[14px] cursor-pointer">
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
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-[16px] font-semibold text-black mb-3">Description</label>
            <textarea
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Briefly describe the purpose and benefits of this campaign."
              className="w-full h-30 p-4 border rounded-lg border-gray-300 outline-0 placeholder-gray-400 bg-gray-50"
            />
          </div>

          {/* Community Link */}
          <div>
            <label className="block text-[16px] font-semibold text-black mb-3">
              Community link
            </label>
            <input
              type="url"
              value={formData.socialLinks}
              onChange={e => handleInputChange('socialLinks', e.target.value)}
              placeholder="Enter your community link ( Telegram / Discord / Forum URL )"
              className="w-full p-4 border border-gray-300 rounded-lg outline-0 text-[14px] placeholder-gray-400 bg-gray-50"
            />
          </div>

          {/* Twitter Link */}
          <div>
            <label className="block text-[16px] font-semibold text-black mb-3">Twitter link</label>
            <input
              type="url"
              value={formData.twitterLink}
              onChange={e => handleInputChange('twitterLink', e.target.value)}
              placeholder="Enter your Twitter link"
              className="w-full p-4 border border-gray-300 rounded-lg outline-0 focus:border-transparent text-[14px] placeholder-gray-400 bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-8 border-t border-gray-200">
        <button
          onClick={handleCreateCampaign}
          disabled={!isFormValid()}
          className="group cursor-pointer bg-main-Black disabled:bg-gray-400 px-6 py-[10.5px] rounded-lg flex items-center gap-2">
          <span className="text-[18px] font-bold text-lime-300 group-disabled:text-white">
            Create Campaign
          </span>
          <ArrowCircleRight className="text-lime-300 text-[24px] group-disabled:text-white" />
        </button>
      </div>
    </div>
  )
}
