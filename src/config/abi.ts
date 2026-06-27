export const CONTRACT_ADDRESS = '0x54e8696C191412A5C1dD32A59F9524E85D4A6895'

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
