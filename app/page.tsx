import dynamic from 'next/dynamic'

const StockTable = dynamic(() => import('./components/StockTable'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className='container m-auto p-4 flex flex-col'>
      <h1 className='text-center font-bold text-xl mb-6'>
        Monopoly Stock Exchange 2.0
      </h1>
      <br />
      <StockTable />
    </main>
  )
}

