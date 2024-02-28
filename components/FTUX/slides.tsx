import { ListItem, UnorderedList } from "@chakra-ui/react";
import {
  ConnectWalletImage,
  DashboardImage,
  Titles,
} from "./components/Graphics";
import { SlideStateProps, TRACK_CATEGORY } from "./shared";
import React from "react";
import { Text, TrackedLink } from "tw-components";

interface Slide {
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
    title: "A complete toolkit to build the frontend of your web3 app.",
    background: "linear-gradient(147.15deg, #410AB6 30.17%, #D45CFF 100.01%)",
    graphic: Titles,
    content: (
      <Text size="body.lg">
        <UnorderedList>
          <ListItem>
            <TrackedLink
              category={TRACK_CATEGORY}
              href="https://portal.thirdweb.com/react"
              isExternal
              label="auth"
              color="blue.500"
            >
              Hooks
            </TrackedLink>{" "}
            and{" "}
            <TrackedLink
              category={TRACK_CATEGORY}
              href="https://portal.thirdweb.com/typescript"
              isExternal
              label="auth"
              color="blue.500"
            >
              functions
            </TrackedLink>{" "}
            that let you easily interact with contracts, wallets, and
            transactions.
          </ListItem>
          <ListItem>
            <TrackedLink
              category={TRACK_CATEGORY}
              href="/dashboard/connect/embedded-wallets"
              isExternal
              label="auth"
              color="blue.500"
            >
              App wallets
            </TrackedLink>{" "}
            with different key management structures.
          </ListItem>
          <ListItem>
            <TrackedLink
              category={TRACK_CATEGORY}
              href="/dashboard/connect/playground"
              isExternal
              label="auth"
              color="blue.500"
            >
              Plug and play UI components
            </TrackedLink>{" "}
            that you can drop into your app to easily integrate web3
            functionality
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
              href="https://portal.thirdweb.com/contracts/build/overview"
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
              href="https://portal.thirdweb.com/contracts/publish/overview"
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
              href="https://portal.thirdweb.com/contracts/interact/overview"
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
              href="https://portal.thirdweb.com/contracts/deploy/overview"
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
    title: "The open-source server for scalable web3 apps.",
    background: "linear-gradient(147.15deg, #B4F1FF -10.17%, #410AB6 100.01%)",
    graphic: Titles,
    content: (
      <Text size="body.lg">
        <UnorderedList>
          <ListItem>Reliably send blockchain transactions.</ListItem>
          <ListItem>Manage smart wallets.</ListItem>
          <ListItem>Enable gasless transactions.</ListItem>
        </UnorderedList>
      </Text>
    ),
  },

  // slide 5
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
