import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { IBot, IPair } from '../context/objects'

export function usePairs() {
  const [pairs, setPairs] = useState<IPair[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function addBot(bot: IBot) {
    // setPairs(prev => [...prev, bot])
  }

  async function fetchProducts() {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('http://localhost:8000/api/pair/', {
        headers: { Authorization: 'Basic bWVvazoxMjM=' },
      })
      setPairs(response.data.data)
      setLoading(false)
    } catch (e: unknown) {
      const error = e as AxiosError
      setError(`Error: ${error.message}`)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { pairs, loading, error, addBot }
}
