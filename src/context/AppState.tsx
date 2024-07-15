import Web3 from 'web3'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useState, useEffect } from 'react'
import { Web3Message } from '../store/w3'

const URL = process.env.REACT_APP_BACKEND_URL

export const AppState = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3>()

  useEffect(() => {
    if ((window as any).ethereum) {
      const web3Instance = new Web3((window as any).ethereum)
      setWeb3(web3Instance)
    } else {
      console.log('No Ethereum provider detected') // TODO: download provider page
    }
  }, [])

  // Web3
  const handleSignMessage = async ({ address, nonce, domain, statement, uri, chainId, timeout }: Web3Message) => {
    try {
      const message: string = `${domain} wants you to sign in with your\nEthereum account: ${address}\n\n${statement}\n\nURI: ${uri}\nChain ID: ${chainId}\nNonce: ${nonce}\nTimeout: ${timeout}`
      const signature: string = await web3!.eth.personal.sign(message, address, '')
      return { message, signature }
    } catch (err) {
      console.log('You need to sign the message to be able to log in', 'Web3')
    }
  }

  const handleAuthenticate = async ({ message, signature }: { message: string; signature: string }) =>
    await axios.post(`${URL}/auth/web3`, { message, signature }).then(async (res: AxiosResponse) => {
      localStorage.setItem('token', res.data.token)
      // await sign(res.data.token)
    })

  const web3login = async () => {
    try {
      await (window as any).ethereum.enable()
    } catch (err: any) {
      console.log('warning', err.message, 'Web3')
      return
    }
    if (!web3) {
      console.log('error', 'Blockchain provider not found', 'Web3')
      return
    }
    let chainId: bigint | null = null
    try {
      chainId = await web3.eth.getChainId()
    } catch (error: any) {
      console.log('warning', error.message, 'Web3')
      return
    }
    if (!chainId) {
      console.log('error', 'Failed to get ChainID', 'Web3')
      return
    }
    const coinbase = await web3.eth.getCoinbase()
    if (!coinbase) {
      console.log('warning', 'Please activate MetaMask first', 'Web3')
      return
    }
    const address = coinbase.toLowerCase()
    await axios
      .get(`${URL}/auth/web3`, { params: { chain: chainId, address } })
      .then(async (res: AxiosResponse) => {
        const signed: { message: string; signature: string } | undefined = await handleSignMessage(res.data)
        if (signed) await handleAuthenticate(signed)
      })
      .catch((err: AxiosError) => {
        console.log('Web3 sign in error')
      })
  }
}
