import { useState, useEffect } from 'react'
import Web3 from 'web3'

interface Web3LoginProps {
  children?: React.ReactNode
}

interface Web3Message {
  address: string
  nonce: string
  domain: string
  statement: string
  uri: string
  chainId: number
  timeout: number
}

export default function Web3Login(props: Web3LoginProps) {
  const [web3, setWeb3] = useState<Web3>()

  useEffect(() => {
    if ((window as any).ethereum) {
      const web3Instance = new Web3((window as any).ethereum)
      setWeb3(web3Instance)
    } else {
      console.error('No Ethereum provider detected')
    }
  }, [])

  const [loading, setLoading] = useState(false) // Loading button state

  const handleAuthenticate = ({ message, signature }: { message: string; signature: string }) =>
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/web3`, {
      body: JSON.stringify({ message, signature }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then((response) => {
      const data = response.json()
      console.log('Response 2', data)
    })

  const handleSignMessage = async ({ address, nonce, domain, statement, uri, chainId, timeout }: Web3Message) => {
    try {
      const message: string = `${domain} wants you to sign in with your\nEthereum account: ${address}\n\n${statement}\n\nURI: ${uri}\nChain ID: ${chainId}\nNonce: ${nonce}\nTimeout: ${timeout}`
      const signature: string = await web3!.eth.personal.sign(message, address, '')
      return { message, signature }
    } catch (err) {
      console.log('You need to sign the message to be able to log in') // msgAdd
      throw new Error('You need to sign the message to be able to log in.')
    }
  }

  const handleClick = async () => {
    // Check if MetaMask is installed
    if (!web3) return

    let chainId: number | null = null
    try {
      chainId = await web3.eth.getChainId()
    } catch (error: any) {
      console.log('Metamask error:', error.code, error.message) // msgAdd error.message
      return
    }

    const coinbase = await web3.eth.getCoinbase()
    if (!coinbase) {
      window.alert('Please activate MetaMask first.') // msgAdd
      return
    }

    const address = coinbase.toLowerCase()

    setLoading(true)

    const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/web3?chain=${chainId}&address=${address}`)
    const resp2: Web3Message = await resp.json()
    const signed: { message: string; signature: string } = await handleSignMessage(resp2)
    const result = await handleAuthenticate(signed)
  }

  return (
    <div>
      <div>{web3 ? 'Metamask exists' : 'No Metamask found'}</div>
      <p>
        Please select your login method.
        <br />
        For the purpose of this demo, only MetaMask login is implemented.
      </p>
      <button className='Login-button Login-mm' onClick={handleClick}>
        {loading ? 'Loading...' : 'Login with MetaMask'}
      </button>
      <button className='Login-button Login-fb' disabled>
        Login with Facebook
      </button>
      <button className='Login-button Login-email' disabled>
        Login with Email
      </button>
    </div>
  )
}
