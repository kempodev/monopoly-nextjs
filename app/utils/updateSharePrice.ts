import { Settings } from '../components/StockTable'

// Function to update share price
export function updateSharePrice(
  sharePrice: number,
  isCrash: boolean,
  settings: Settings
) {
  // Check if a crash occurs
  if (isCrash) {
    // Crash! Decrease share price significantly
    sharePrice *= settings.crashPriceFactor
  } else {
    // Generate a random number between -shortTermVolatility and shortTermVolatility
    const shortTermChange =
      Math.random() * settings.shortTermVolatility * 2 -
      settings.shortTermVolatility

    // Apply the short-term change to the share price
    sharePrice += shortTermChange

    // Apply the long-term upward trend
    sharePrice *= settings.longTermTrend

    // Ensure sharePrice is always positive
    if (sharePrice < 0) {
      sharePrice = 0
    }
  }
  return Math.floor(sharePrice)
}

export function checkCrash(crashProbability: number, settings: Settings) {
  if (Math.random() < crashProbability) {
    // Crash! Decrease share price significantly

    return {
      isCrash: true,
      crashProbability: settings.initialCrashProbability,
    }
  } else {
    // Increase the crash probability if no crash
    let newCrashProbability = crashProbability + settings.crashFactor / 100
    if (newCrashProbability > settings.maxCrashProbability) {
      newCrashProbability = settings.maxCrashProbability
    }

    return {
      isCrash: false,
      crashProbability: newCrashProbability,
    }
  }
}
