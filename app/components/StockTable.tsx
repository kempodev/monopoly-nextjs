'use client'

import { useEffect, useState } from 'react'
import { checkCrash, updateSharePrice } from '../utils/updateSharePrice'
import Settings from './SettingsPanel'

type Share = {
  id: number
  price: number
  change: number
}

export type Settings = {
  shortTermVolatility: number
  longTermTrend: number
  crashPriceFactor: number
  maxCrashProbability: number
  crashFactor: number
  initialCrashProbability: number
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

export const initialSettings: Settings = {
  shortTermVolatility: 6, // Change this value to control short-term fluctuations
  longTermTrend: 1.03, // Change this value to control long-term growth rate
  crashPriceFactor: 0.5, // Coefficient for prices in case of crash
  maxCrashProbability: 0.1, // Maximum crash probability
  crashFactor: 1, // Increase in probability after each update in case of no crash
  initialCrashProbability: 0.01, // Reset crash prob to this after crash
}

const maxShares = 10

export default function StockTable() {
  const [shares, setShares] = useState<Share[]>(initialShares)
  const [roundCount, setRoundCount] = useState(0)
  const [crashProbability, setCrashProbability] = useState(0.01)
  const [message, setMessage] = useState('')
  const [settings, setSettings] = useState(initialSettings)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Check if there is a previously saved game
    const shares = localStorage.getItem('shares')
    const roundCount = localStorage.getItem('roundCount')
    const crashProbability = localStorage.getItem('crashProbability')
    const message = localStorage.getItem('message')
    const settings = localStorage.getItem('settings')

    if (!shares || !roundCount || !crashProbability || !settings) return

    setShares(JSON.parse(shares))
    setRoundCount(JSON.parse(roundCount))
    setCrashProbability(JSON.parse(crashProbability))
    setSettings(JSON.parse(settings))
    if (message) {
      setMessage(message)
    }
    console.log('Game loaded')
  }, [])

  const handleRefresh = () => {
    setIsSaved(false)
    const { isCrash, crashProbability: prob } = checkCrash(
      crashProbability,
      settings
    )

    if (isCrash) {
      setMessage('Stock Market Crash!')
    } else {
      setMessage('')
    }
    const newShares = shares.map((share) => {
      const newPrice = updateSharePrice(share.price, isCrash, settings)
      return {
        ...share,
        price: newPrice,
        change: newPrice - share.price,
      }
    })

    setShares(newShares)
    setCrashProbability(prob)
    setRoundCount((prev) => prev + 1)
  }

  const handleShareRemove = (e: React.MouseEvent<HTMLElement>, id: number) => {
    const res = confirm(`Are you sure you want to remove Share ${id}?`)
    if (res) {
      setShares((prevShares) => prevShares.filter((share) => share.id !== id))
    }
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

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev)
  }

  const handleSave = () => {
    setIsSaved(true)
    localStorage.setItem('shares', JSON.stringify(shares))
    localStorage.setItem('roundCount', JSON.stringify(roundCount))
    localStorage.setItem('crashProbability', JSON.stringify(crashProbability))
    localStorage.setItem('message', message)
    localStorage.setItem('settings', JSON.stringify(settings))
    console.log('Game saved')
  }

  const startNewGame = () => {
    console.log('new game')
    confirm(
      'Are you sure you want to start a new game? This will delete your current save.'
    )
    localStorage.removeItem('shares')
    localStorage.removeItem('roundCount')
    localStorage.removeItem('crashProbability')
    localStorage.removeItem('message')
    localStorage.removeItem('settings')
    location.reload()
  }

  const headerEls = (
    <tr>
      <th></th>
      {shares.map((share) => {
        return (
          <th key={share.id} className='border'>
            <button
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                handleShareRemove(e, share.id)
              }
            >{`Share ${share.id}`}</button>
          </th>
        )
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

  return (
    <>
      <div className='flex justify-between my-6 text-xs md:text-sm'>
        <div className='w-1/4'>
          <div>Round:</div>
          <div>{roundCount}</div>
        </div>
        <div
          className={`w-1/2 text-center font-semibold text-red-700 ${
            message !== '' ? 'animate-bounce' : ''
          }`}
        >
          {message}
        </div>
        <div className='w-1/4 text-right'>
          <div>Crash prob:</div>
          <div>{`${Math.round(crashProbability * 100)}%`}</div>
        </div>
      </div>
      <table className='table-auto border-collapse text-xs md:text-sm'>
        <thead className='border-inherit'>{headerEls}</thead>
        <tbody>
          {priceEls}
          {changeEls}
        </tbody>
      </table>
      <div className='grid grid-cols-2 md:flex justify-center gap-4 mt-8 text-sm'>
        <button
          className='col-span-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white p-3 md:p-4'
          onClick={handleRefresh}
        >
          Refresh Prices
        </button>
        {shares.length < maxShares ? (
          <button
            className='rounded-full bg-white text-cyan-500 border-2 border-cyan-500 hover:bg-cyan-100 p-2 md:p-4'
            onClick={handleShareAdd}
          >
            Add Share
          </button>
        ) : null}
        <button
          className='rounded-full bg-white text-cyan-500 border-2 border-cyan-500 hover:bg-cyan-100 p-2 md:p-4'
          onClick={toggleSettings}
        >
          {isSettingsOpen ? 'Close Settings' : 'Open Settings'}
        </button>
        <button
          className='rounded-full bg-white text-cyan-500 border-2 border-cyan-500 hover:bg-cyan-100 p-2 md:p-4'
          onClick={handleSave}
        >
          {isSaved ? 'Saved!' : 'Save game'}
        </button>
        <button
          className='rounded-full bg-white text-cyan-500 border-2 border-cyan-500 hover:bg-cyan-100 p-2 md:p-4'
          onClick={startNewGame}
        >
          New game
        </button>
      </div>
      {isSettingsOpen ? (
        <Settings settings={settings} setSettings={setSettings} />
      ) : null}
    </>
  )
}
