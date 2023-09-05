// Short-term volatility factor (adjust as needed)
const shortTermVolatility = 5 // Change this value to control short-term fluctuations

// Long-term upward trend factor (adjust as needed)
const longTermTrend = 1.03 // Change this value to control long-term growth rate

// Function to update share price
export function updateSharePrice(sharePrice: number, isCrash: boolean) {
  // console.log('crashProbability', crashProbability)
  // Check if a crash occurs
  if (isCrash) {
    // Crash! Decrease share price significantly
    sharePrice *= 0.5 // You can adjust this factor as needed
    // console.log('Stock Market Crash!')
  } else {
    // Generate a random number between -shortTermVolatility and shortTermVolatility
    const shortTermChange =
      Math.random() * shortTermVolatility * 2 - shortTermVolatility

    // Apply the short-term change to the share price
    sharePrice += shortTermChange

    // Apply the long-term upward trend
    sharePrice *= longTermTrend

    // Ensure sharePrice is always positive
    if (sharePrice < 0) {
      sharePrice = 0
    }
  }
  return Math.floor(sharePrice)
}

export function checkCrash(crashProbability: number) {
  // console.log(crashProbability)
  // Crash probability settings
  const maxCrashProbability = 0.1 // Maximum crash probability
  const crashFactor = 1 // Increase in probability after each update in case of no crash

  if (Math.random() < crashProbability) {
    // Crash! Decrease share price significantly
    // console.log('Stock Market Crash!')

    return {
      isCrash: true,
      crashProbability: 0.01,
    }
  } else {
    // Increase the crash probability if no crash
    let newCrashProbability = crashProbability + crashFactor / 100
    if (newCrashProbability > maxCrashProbability) {
      newCrashProbability = maxCrashProbability
    }

    return {
      isCrash: false,
      crashProbability: newCrashProbability,
    }
  }
}
