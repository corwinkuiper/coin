"use client";

import { useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const CoinList = styled.ul`
  width: 100%;
  word-wrap: break-word;
  padding: 0;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-wrap: wrap;
`;

const coinFlipAnimation = keyframes`
  from {
    transform: rotateY(0);
  }

  to {
    transform: rotateY(180deg);
  }
`;

const Coin = styled.div`
  animation: ${coinFlipAnimation} 0.5s alternate linear 2;
`;

const FlipCoinButton = styled.button`
  min-height: 20vh;
  font: inherit;
  color: inherit;
  background-color: var(--button-background);
  border-color: hsl(0 0 50%);
`;

const SummaryCounts = styled.section`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const CoinFlipSection = styled.section`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
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
  const coinListRef = useRef<HTMLUListElement>(null);

  function addCoin() {
    const clickTime = new Date();
    const timeSince = clickTime.getTime() - lastClickTime.getTime();
    const resetCoin = timeSince > 4000;

    const newCoinValue = coinFlip();
    const newCoins = resetCoin ? [] : [...coins];
    newCoins.push({ value: newCoinValue, id: crypto.randomUUID() });
    setCoins(newCoins);
    setLastClickTime(clickTime);

    if (coinListRef.current) {
      const height = coinListRef.current.scrollHeight;
      coinListRef.current.scrollBy(0, height);
    }
  }

  return (
    <CoinFlipSection>
      <CoinList ref={coinListRef}>
        {coins.map((x) => (
          <Coin key={x.id}>
            <code>{x.value ? "H" : "T"}</code>
          </Coin>
        ))}
      </CoinList>
      <SummaryCounts>
        <div>
          Heads: <code>{coins.filter((x) => x.value).length}</code>
        </div>
        <div>
          Tails: <code>{coins.filter((x) => !x.value).length}</code>
        </div>
        <div>
          Total: <code>{coins.length}</code>
        </div>
      </SummaryCounts>
      <FlipCoinButton onClick={addCoin}>Flip!</FlipCoinButton>
    </CoinFlipSection>
  );
}
