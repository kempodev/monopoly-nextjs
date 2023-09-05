'use client'

import { useState } from 'react'
import { checkCrash, updateSharePrice } from '../utils/updateSharePrice'

type Share = {
  id: number
  price: number
  change: number
}

const initialShares: Share[] = [
  {
    id: 1,
    price: 100,
    change: 0,
  },
  {
    id: 2,
    price: 100,
    change: 0,
  },
  {
    id: 3,
    price: 100,
    change: 0,
  },
]

const maxShares = 10

export default function StockTable() {
  const [shares, setShares] = useState<Share[]>(initialShares)
  const [roundCount, setRoundCount] = useState(0)
  const [crashProbability, setCrashProbability] = useState(0.01)
  const [message, setMessage] = useState('')

  const headerEls = (
    <tr>
      <th></th>
      {shares.map((share) => {
        return <th key={share.id} className='border'>{`Share ${share.id}`}</th>
      })}
    </tr>
  )
  const priceEls = (
    <tr className='border'>
      <td className='pl-2'>Price</td>
      {shares.map((share) => {
        return (
          <td key={share.id} className='border text-right px-2'>
            {share.price}
          </td>
        )
      })}
    </tr>
  )
  const changeEls = (
    <tr className='border'>
      <td className='pl-2'>Change</td>
      {shares.map((share) => {
        let bgColor = ''
        if (share.change !== 0) {
          bgColor = share.change < 0 ? 'bg-red-200' : 'bg-green-200'
        }
        return (
          <td key={share.id} className={`border text-right px-2 ${bgColor}`}>
            {share.change}
          </td>
        )
      })}
    </tr>
  )

  const handleRefresh = () => {
    // console.log(checkCrash(crashProbability))
    const { isCrash, crashProbability: prob } = checkCrash(crashProbability)
    // console.log(shares)
    if (isCrash) {
      setMessage('Stock Market Crash!')
    } else {
      setMessage('')
    }
    const newShares = shares.map((share) => {
      const newPrice = updateSharePrice(share.price, isCrash)
      return {
        ...share,
        price: newPrice,
        change: newPrice - share.price,
      }
    })
    // console.log(newShares)
    setShares(newShares)
    setCrashProbability(prob)
    setRoundCount((prev) => prev + 1)
  }

  const handleShareAdd = () => {
    if (shares.length < maxShares) {
      let highestId = 0
      shares.forEach((share) => {
        if (share.id > highestId) {
          highestId = share.id
        }
      })
      setShares((prevShares) => [
        ...prevShares,
        {
          id: highestId + 1,
          price: 100,
          change: 0,
        },
      ])
    }
  }

  return (
    <>
      <div className='flex justify-between my-6'>
        <div className='w-1/4'>Round: {roundCount}</div>
        <div
          className={`w-1/2 text-center font-semibold text-red-700 ${
            message !== '' ? 'animate-bounce' : ''
          }`}
        >
          {message}
        </div>
        <div className='w-1/4 text-right'>
          Crash probability: {`${Math.round(crashProbability * 100)}%`}
        </div>
      </div>
      <table className='table-auto border-collapse'>
        <thead className='border-inherit'>{headerEls}</thead>
        <tbody>
          {priceEls}
          {changeEls}
        </tbody>
      </table>
      <div className='flex justify-center gap-6 my-6'>
        <button
          className='rounded-full bg-cyan-500 hover:bg-cyan-400 text-white p-3'
          onClick={handleRefresh}
        >
          Refresh Prices
        </button>
        {shares.length < maxShares ? (
          <button
            className='rounded-full bg-cyan-500 hover:bg-cyan-400 text-white p-3'
            onClick={handleShareAdd}
          >
            Add Share
          </button>
        ) : null}
      </div>
    </>
  )
}
