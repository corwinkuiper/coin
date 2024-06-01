"use client";

import { useState } from "react";
import styled from "styled-components";

const CoinList = styled.ul`
  width: 100%;
  word-wrap: break-word;
  padding: 0;
`;

const Coin = styled.div`
  display: inline;
`;

const FlipCoinButton = styled.button`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 20vh;
`;

interface Coin {
  value: boolean;
  id: string;
}

function coinFlip() {
  const arr = new Uint8Array([0]);
  crypto.getRandomValues(arr);
  return (arr[0] & 1) == 0;
}

export function CoinFlipper() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [lastClickTime, setLastClickTime] = useState(new Date());

  function addCoin() {
    const clickTime = new Date();
    const timeSince = clickTime.getTime() - lastClickTime.getTime();
    console.log(timeSince);
    const resetCoin = timeSince > 4000;

    const newCoinValue = coinFlip();
    const newCoins = resetCoin ? [] : [...coins];
    newCoins.push({ value: newCoinValue, id: crypto.randomUUID() });
    setCoins(newCoins);
    setLastClickTime(clickTime);
  }

  return (
    <>
      <CoinList>
        {coins.map((x) => (
          <Coin key={x.id}>
            <code>{x.value ? "H" : "T"}</code>
          </Coin>
        ))}
      </CoinList>
      <div>
        Heads: <code>{coins.filter((x) => x.value).length}</code>
      </div>
      <div>
        Tails: <code>{coins.filter((x) => !x.value).length}</code>
      </div>
      <div>
        Total: <code>{coins.length}</code>
      </div>
      <FlipCoinButton onClick={addCoin}>Flip!</FlipCoinButton>
    </>
  );
}
