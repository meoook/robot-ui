import style from './coin.module.scss'

interface CoinInputProps {
  children?: React.ReactNode
  balance: number
  value: string
  onChange: (value: string) => void
}

export default function CoinInput({ balance, value, onChange }: CoinInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const regex = /^[0-9]*\.?[0-9]*$/
    if (regex.test(inputValue)) onChange(inputValue)
  }

  const setPercent = (percent: number) => {
    const value: number = (balance / 100) * percent
    const round: number = Number(value.toFixed(6))
    onChange(`${round}`)
  }

  return (
    <div className={style.coin}>
      <label>
        <div className={style.input}>
          <input
            inputMode='decimal'
            title='Сумма токенов'
            autoComplete='off'
            autoCorrect='off'
            type='text'
            placeholder='0.0'
            minLength={1}
            maxLength={35}
            spellCheck={false}
            value={value}
            onChange={handleChange}
          />
        </div>
        <div></div>
        <div className={style.amount}>
          <button onClick={() => setPercent(25)}>25%</button>
          <button onClick={() => setPercent(50)}>50%</button>
          <button onClick={() => setPercent(75)}>75%</button>
          <button onClick={() => setPercent(100)}>MAX</button>
        </div>
      </label>
    </div>
  )
}
