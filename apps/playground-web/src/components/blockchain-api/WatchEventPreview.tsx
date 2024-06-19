"use client";

import { useEffect, useState } from "react";

type Item = {
  addr1: string;
  addr2: string;
  value: string;
};

export function WatchEventPreview() {
  const generateFakeEthereumAddress = (): string => {
    const characters = "0123456789abcdef";
    const start = "0x";
    let firstPart = "";
    let lastPart = "";
    for (let i = 0; i < 2; i++) {
      firstPart += characters[Math.floor(Math.random() * characters.length)];
    }
    for (let i = 0; i < 4; i++) {
      lastPart += characters[Math.floor(Math.random() * characters.length)];
    }
    return `${start}${firstPart}...${lastPart}`;
  };
  const generateFakeNumber = () => {
    const number = Math.floor(Math.random() * 10000) + 1;
    return number.toLocaleString();
  };
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const fakeEthereumAddress1 = generateFakeEthereumAddress();
      const fakeEthereumAddress2 = generateFakeEthereumAddress();
      const fakeNumber = generateFakeNumber();
      const _item: Item = {
        addr1: fakeEthereumAddress1,
        addr2: fakeEthereumAddress2,
        value: fakeNumber,
      };
      setItems((prevItems) => {
        const updatedNotifications = [_item, ...prevItems];
        if (updatedNotifications.length > 5) {
          updatedNotifications.pop();
        }
        return updatedNotifications;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <span className="font-bold">{item.addr1}</span> transferred{" "}
            <span className="font-bold text-green-500">{item.value} USDC</span>{" "}
            to <span className="font-bold">{item.addr2}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
