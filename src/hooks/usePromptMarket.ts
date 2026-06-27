import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { ABI, CONTRACT_ADDRESS } from '../config/abi'

export function useBuyPrompt() {
  const { writeContractAsync, isPending, error } = useWriteContract()

  const buy = async (promptId: number, priceInMon: number): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'buyPrompt',
      args: [BigInt(promptId)],
      value: parseEther(priceInMon.toString()),
    })
  }

  return { buy, isPending, error }
}
