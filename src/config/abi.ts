export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ABI = [
  {
    name: 'buyPrompt',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'hasPurchased',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'buyer',    type: 'address' },
      { name: 'promptId', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'PromptUnlocked',
    type: 'event',
    inputs: [
      { name: 'id',    type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: false },
    ],
  },
] as const
