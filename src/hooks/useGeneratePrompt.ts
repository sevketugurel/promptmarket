import { useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACT_ADDRESS } from '../config/abi'

export function useGeneratePrompt() {
  const { sendTransactionAsync, isPending } = useSendTransaction()

  const pay = async (): Promise<`0x${string}`> => {
    return sendTransactionAsync({
      to: CONTRACT_ADDRESS as `0x${string}`,
      value: parseEther('1.0'),
    })
  }

  return { pay, isPending }
}
