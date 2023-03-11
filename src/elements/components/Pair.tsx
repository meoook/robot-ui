import React, { useState } from 'react'
import { IPair } from '../../objects/md_pair'

interface ProductProps {
  pair: IPair
}

export default function Pair({ pair }: ProductProps) {
  const [display, setDisplay] = useState(false)

  const btnBgClassName = display ? 'bg-blue-400' : 'bg-yellow-400'
  const btnClasses = ['py-2 px-4 border', btnBgClassName]
  return (
    <div className='border py-2 px-4 rounded flex flex-col items-center mb-2'>
      <p>{pair.symbol}</p>
      <p className='font-bold'>{pair.leverage}</p>
      <button className={btnClasses.join(' ')} onClick={() => setDisplay((prev) => !prev)}>
        {display ? 'Hide' : 'Show'} details
      </button>
      {display && <p> {pair.futures}</p>}
    </div>
  )
}
