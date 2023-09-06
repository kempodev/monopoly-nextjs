import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { Settings, initialSettings } from './StockTable'

export default function SettingsPanel({
  settings,
  setSettings,
}: {
  settings: Settings
  setSettings: Dispatch<SetStateAction<Settings>>
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setSettings({
      ...settings,
      [name]: parseFloat(value), // Parse the input value as a float
    })
  }

  const resetSettings = (): void => {
    if (confirm('Are you sure you want to reset the settings?')) {
      setSettings(initialSettings)
    }
  }

  return (
    <div className='p-4 mt-4 bg-gray-200 rounded-md'>
      <h2 className='text-lg font-semibold mb-4'>Settings</h2>
      <form>
        <div className='mb-2'>
          <label htmlFor='shortTermVolatility' className='block text-gray-600'>
            Short Term Volatility
          </label>
          <input
            type='number'
            step={1}
            id='shortTermVolatility'
            name='shortTermVolatility'
            value={settings.shortTermVolatility}
            onChange={handleChange}
            className='w-full p-2 border rounded-md border-gray-400'
          />
        </div>
        <div className='mb-2'>
          <label htmlFor='longTermTrend' className='block text-gray-600'>
            Long Term Trend
          </label>
          <input
            type='number'
            step={0.01}
            id='longTermTrend'
            name='longTermTrend'
            value={settings.longTermTrend}
            onChange={handleChange}
            className='w-full p-2 border rounded-md border-gray-400'
          />
        </div>
        <div className='mb-2'>
          <label htmlFor='crashPriceFactor' className='block text-gray-600'>
            Crash Price Factor
          </label>
          <input
            type='number'
            step={0.01}
            id='crashPriceFactor'
            name='crashPriceFactor'
            value={settings.crashPriceFactor}
            onChange={handleChange}
            className='w-full p-2 border rounded-md border-gray-400'
          />
        </div>
        <div className='mb-2'>
          <label htmlFor='maxCrashProbability' className='block text-gray-600'>
            Max Crash Probability
          </label>
          <input
            type='number'
            step={0.01}
            id='maxCrashProbability'
            name='maxCrashProbability'
            value={settings.maxCrashProbability}
            onChange={handleChange}
            className='w-full p-2 border rounded-md border-gray-400'
          />
        </div>
        <div className='mb-2'>
          <label htmlFor='crashFactor' className='block text-gray-600'>
            Crash Factor
          </label>
          <input
            type='number'
            step={1}
            id='crashFactor'
            name='crashFactor'
            value={settings.crashFactor}
            onChange={handleChange}
            className='w-full p-2 border rounded-md border-gray-400'
          />
        </div>
        <div className='mb-2'>
          <label
            htmlFor='initialCrashProbability'
            className='block text-gray-600'
          >
            Initial Crash Probability
          </label>
          <input
            type='number'
            step={0.01}
            id='initialCrashProbability'
            name='initialCrashProbability'
            value={settings.initialCrashProbability}
            onChange={handleChange}
            className='w-full p-2 border rounded-md border-gray-400'
          />
        </div>
      </form>
      <div className='mt-4'>
        <button
          onClick={resetSettings}
          className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md'
        >
          Reset Settings
        </button>
      </div>
    </div>
  )
}
