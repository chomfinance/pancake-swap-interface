import { Token } from "@pancakeswap-libs/sdk"
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'

// Rewrite in order to fix bug
let PAIR_ADDRESS_CACHE: { [token0Address: string]: { [token1Address: string]: string } } = {}

export const FACTORY_ADDRESS = '0xF4445B87b88B7f2A925Ea97549F5c9EBB6D1e070'

export const INIT_CODE_HASH = '0xdae72ab5b0c29f038951c66df89716f948324709eb6f1034bc289366798fca90'

export function pairGetAddress(tokenA: Token, tokenB: Token): string {
  const tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

  console.log(tokens)

  if (PAIR_ADDRESS_CACHE?.[tokens[0].address]?.[tokens[1].address] === undefined) {
    PAIR_ADDRESS_CACHE = {
      ...PAIR_ADDRESS_CACHE,
      [tokens[0].address]: {
        ...PAIR_ADDRESS_CACHE?.[tokens[0].address],
        [tokens[1].address]: getCreate2Address(
          FACTORY_ADDRESS,
          keccak256(['bytes'], [pack(['address', 'address'], [tokens[0].address, tokens[1].address])]),
          INIT_CODE_HASH
        )
      }
    }
  }

  return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address]
}