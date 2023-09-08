import { ListItem, UnorderedList } from "@chakra-ui/react";
import {
  ConnectWalletImage,
  DashboardImage,
  Titles,
} from "./components/Graphics";
import { SlideStateProps, TRACK_CATEGORY } from "./shared";
import React from "react";
import { Text, TrackedLink } from "tw-components";

export interface Slide {
  title: React.ReactNode;
  background: string;
  graphic: React.FC<SlideStateProps>;
  content: React.ReactNode;
}

export const slides: Slide[] = [
  // slide 1
  {
    title: (
      <>
        The complete web3 <br />
        development framework.
      </>
    ),
    background: "linear-gradient(147.15deg, #410AB6 30.17%, #B4F1FF 100.01%)",
    graphic: DashboardImage,
    content: (
      <Text size="body.lg" w="90%">
        Everything you need to connect your apps or games to decentralized
        networks. Powerful tools that simplify web3 development.
      </Text>
    ),
  },

  // slide 2
  {
    title: "Onboard, authenticate, and manage users.",
    background: "linear-gradient(147.15deg, #410AB6 30.17%, #D45CFF 100.01%)",
    graphic: Titles,
    content: (
      <Text size="body.lg">
        <UnorderedList>
          <ListItem>
            {" "}
            <TrackedLink
              category={TRACK_CATEGORY}
              href="/dashboard/wallets/connect"
              label="connect-wallet"
              color="blue.500"
            >
              Connect any wallets
            </TrackedLink>{" "}
            to your apps and games.
          </ListItem>
          <ListItem>
            <TrackedLink
              category={TRACK_CATEGORY}
              href="https://portal.thirdweb.com/wallet/paper"
              isExternal
              label="auth"
              color="blue.500"
            >
              Create wallets
            </TrackedLink>{" "}
            with different key management structures.
          </ListItem>
          <ListItem>
            {" "}
            <TrackedLink
              category={TRACK_CATEGORY}
              href="https://portal.thirdweb.com/auth"
              isExternal
              label="auth"
              color="blue.500"
            >
              Prove wallet ownership
            </TrackedLink>{" "}
            to off-chain system.
          </ListItem>
        </UnorderedList>
      </Text>
    ),
  },

  // slide 3
  {
    title: "Create, deploy, and manage smart contracts on any EVM network.",
    background: "linear-gradient(147.15deg, #410AB6 30.17%, #5CFFE1 100.01%)",
    graphic: Titles,
    content: (
      <Text size="body.lg">
        <UnorderedList>
          <ListItem>
            {" "}
            <TrackedLink
              category={TRACK_CATEGORY}
              href="https://portal.thirdweb.com/solidity"
              label="write"
              isExternal
              color="blue.500"
            >
              Write your own contracts
            </TrackedLink>
            .
          </ListItem>
          <ListItem>
            <TrackedLink
              category={TRACK_CATEGORY}
              href="https://portal.thirdweb.com/publish"
              label="publish"
              isExternal
              color="blue.500"
            >
              Publish your contracts on-chain
            </TrackedLink>
            .
          </ListItem>
          <ListItem>
            Discover{" "}
            <TrackedLink
              category={TRACK_CATEGORY}
              href="/explore"
              label="explore"
              color="blue.500"
            >
              ready-to-deploy contracts
            </TrackedLink>
            .
          </ListItem>
          <ListItem>
            {" "}
            <TrackedLink
              category={TRACK_CATEGORY}
              href="https://portal.thirdweb.com/sdk"
              isExternal
              label="interact"
              color="blue.500"
            >
              Interact
            </TrackedLink>{" "}
            with contracts.
          </ListItem>
          <ListItem>
            {" "}
            <TrackedLink
              category={TRACK_CATEGORY}
              href="https://portal.thirdweb.com/deploy"
              isExternal
              label="deploy"
              color="blue.500"
            >
              Deploy
            </TrackedLink>{" "}
            contracts to blockchain.
          </ListItem>
        </UnorderedList>
      </Text>
    ),
  },

  // slide 4
  {
    title: "Facilitate financial transactions on the blockchain.",
    background: "linear-gradient(147.15deg, #B4F1FF -10.17%, #410AB6 100.01%)",
    graphic: Titles,
    content: (
      <Text size="body.lg">
        <UnorderedList>
          <ListItem>
            <TrackedLink
              category={TRACK_CATEGORY}
              href="https://withpaper.com/product/checkouts"
              isExternal
              label="checkout"
              color="blue.500"
            >
              Credit card and cross-chain checkouts for NFTs
            </TrackedLink>
            .
          </ListItem>
          <ListItem>Enable gasless transactions.</ListItem>
          <ListItem>Fiat on-ramp.</ListItem>
        </UnorderedList>
      </Text>
    ),
  },

  // slide 5
  {
    title: "Connect your application to decentralized networks.",
    background: "linear-gradient(147.15deg, #5CFFE1 -10.17%, #410AB6 100.01%)",
    graphic: Titles,
    content: (
      <Text size="body.lg">
        <UnorderedList>
          <ListItem>
            Upload files to{" "}
            <TrackedLink
              category={TRACK_CATEGORY}
              href="/dashboard/storage"
              label="storage"
              color="blue.500"
            >
              Storage
            </TrackedLink>
            .
          </ListItem>
          <ListItem>Download files from Gateway.</ListItem>
          <ListItem>
            Access to on-chain data with{" "}
            <TrackedLink
              category={TRACK_CATEGORY}
              href="/dashboard/rpc-edge"
              label="rpc-edge"
              color="blue.500"
            >
              RPC Edge
            </TrackedLink>
            .
          </ListItem>
        </UnorderedList>
      </Text>
    ),
  },

  // slide 6
  {
    title: "Connect a wallet to get started.",
    background: "linear-gradient(147.15deg, #410AB6 30.17%, #FF8D5C 100.01%)",
    graphic: ConnectWalletImage,
    content: (
      <Text size="body.lg" w="90%">
        By connecting your wallet you acknowledge that you have read and agree
        to our{" "}
        <TrackedLink
          href="/privacy"
          isExternal
          category="notice"
          label="privacy"
          textDecoration="underline"
          _hover={{
            opacity: 0.8,
          }}
        >
          Privacy Policy
        </TrackedLink>{" "}
        and{" "}
        <TrackedLink
          href="/tos"
          isExternal
          category="notice"
          label="terms"
          textDecoration="underline"
          _hover={{
            opacity: 0.8,
          }}
        >
          Terms of Service
        </TrackedLink>
        .
      </Text>
    ),
  },
];

export const lastSlideIndex = slides.length - 1;
