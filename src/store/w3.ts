import Web3, { TransactionReceipt } from 'web3'
import axios, { AxiosError, AxiosResponse } from 'axios'

export interface Web3Message {
  address: string
  nonce: string
  domain: string
  statement: string
  uri: string
  chainId: number
  timeout: number
}

class W3Client {
  private w3: Web3
  private account: string | null = null

  constructor() {
    // this.w3 = new Web3((window as any).ethereum)
    if (window.ethereum) {
      this.w3 = new Web3(window.ethereum)
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          this.account = accounts[0]
        })
        .catch((err: any) => {
          console.error('User denied account access', err)
        })
    } else {
      throw new Error('Non-Ethereum browser detected')
    }
  }

  // getAddress = () => {
  //   this.w3.eth.requestAccounts()
  // }

  handleError = (err: AxiosError, text: string) => {
    if (!err.response) throw new Error('Connection error')
    else throw new Error(text)
  }

  // Web3
  handleSignMessage = async ({ address, nonce, domain, statement, uri, chainId, timeout }: Web3Message) => {
    try {
      const message: string = `${domain} wants you to sign in with your\nEthereum account: ${address}\n\n${statement}\n\nURI: ${uri}\nChain ID: ${chainId}\nNonce: ${nonce}\nTimeout: ${timeout}`
      const signature: string = await this.w3.eth.personal.sign(message, address, '')
      return { message, signature }
    } catch (err) {
      throw new Error('You need to sign the message to be able to log in')
    }
  }

  handleAuthenticate = async ({ message, signature }: { message: string; signature: string }) =>
    await axios.post(`${URL}/auth/web3`, { message, signature }).then(async (res: AxiosResponse) => {
      localStorage.setItem('token', res.data.token)
    })

  web3login = async () => {
    if (!this.w3) throw new Error('Blockchain provider not found')
    try {
      await window.ethereum.enable()
    } catch (err: any) {
      throw new Error(err.message)
    }

    let chainId: bigint | null = null
    try {
      chainId = await this.w3.eth.getChainId()
    } catch (error: any) {
      throw new Error(error.message)
    }

    if (!chainId) throw new Error('Failed to get ChainID')
    const coinbase = await this.w3.eth.getCoinbase()
    if (!coinbase) throw new Error('Please activate MetaMask first')

    const address = coinbase.toLowerCase()
    await axios
      .get(`${URL}/auth/web3`, { params: { chain: chainId, address } })
      .then(async (res: AxiosResponse) => {
        const signed: { message: string; signature: string } | undefined = await this.handleSignMessage(res.data)
        if (signed) await this.handleAuthenticate(signed)
      })
      .catch((err: AxiosError) => {
        this.handleError(err, 'Web3 sign in error')
      })
  }

  // Method to get the balance of the current account
  public async getBalance(): Promise<bigint> {
    if (!this.account) throw new Error('Account is not set')
    return await this.w3.eth.getBalance(this.account)
  }

  // Method to send a transaction
  public async sendTransaction(to: string, value: string): Promise<TransactionReceipt | void> {
    if (!this.account) throw new Error('Account is not set')

    const tx = {
      from: this.account,
      to: to,
      value: this.w3.utils.toWei(value, 'ether'),
      gas: 2000000,
    }

    return await this.w3.eth.sendTransaction(tx)
  }

  // Method to call a contract method
  public async callContractMethod(contractAddress: string, abi: any, methodName: string, params: any[]): Promise<any> {
    const contract = new this.w3.eth.Contract(abi, contractAddress)
    return await contract.methods[methodName](...params).call()
  }
}
