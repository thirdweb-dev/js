import { describe, expect, it } from "vitest";
import { genericWalletIcon, getSocialIcon, socialIcons } from "./walletIcon.js";

const emailIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjMzMzUgMi42NjY1SDIuNjY2ODNDMS45MzA0NSAyLjY2NjUgMS4zMzM1IDMuMjYzNDYgMS4zMzM1IDMuOTk5ODRWMTEuOTk5OEMxLjMzMzUgMTIuNzM2MiAxLjkzMDQ1IDEzLjMzMzIgMi42NjY4MyAxMy4zMzMySDEzLjMzMzVDMTQuMDY5OSAxMy4zMzMyIDE0LjY2NjggMTIuNzM2MiAxNC42NjY4IDExLjk5OThWMy45OTk4NEMxNC42NjY4IDMuMjYzNDYgMTQuMDY5OSAyLjY2NjUgMTMuMzMzNSAyLjY2NjVaIiBzdHJva2U9IiMzMzg1RkYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTQuNjY2OCA0LjY2NjVMOC42ODY4MyA4LjQ2NjVDOC40ODEwMSA4LjU5NTQ1IDguMjQzMDQgOC42NjM4NCA4LjAwMDE2IDguNjYzODRDNy43NTcyOCA4LjY2Mzg0IDcuNTE5MzEgOC41OTU0NSA3LjMxMzUgOC40NjY1TDEuMzMzNSA0LjY2NjUiIHN0cm9rZT0iIzMzODVGRiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=";
const phoneIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzU2MzlfNjMyKSI+CjxwYXRoIGQ9Ik0xNC42NjY5IDExLjI4MDJWMTMuMjgwMkMxNC42Njc3IDEzLjQ2NTkgMTQuNjI5NyAxMy42NDk3IDE0LjU1NTMgMTMuODE5OEMxNC40ODA5IDEzLjk4OTkgMTQuMzcxOCAxNC4xNDI2IDE0LjIzNSAxNC4yNjgxQzE0LjA5ODIgMTQuMzkzNyAxMy45MzY3IDE0LjQ4OTIgMTMuNzYwOCAxNC41NDg3QzEzLjU4NDkgMTQuNjA4MiAxMy4zOTg1IDE0LjYzMDMgMTMuMjEzNiAxNC42MTM2QzExLjE2MjIgMTQuMzkwNyA5LjE5MTYxIDEzLjY4OTcgNy40NjAyOCAxMi41NjY5QzUuODQ5NSAxMS41NDMzIDQuNDgzODQgMTAuMTc3NyAzLjQ2MDI4IDguNTY2ODlDMi4zMzM2IDYuODI3NyAxLjYzMjQ0IDQuODQ3NTYgMS40MTM2MSAyLjc4Njg5QzEuMzk2OTUgMi42MDI1NCAxLjQxODg2IDIuNDE2NzMgMS40Nzc5NSAyLjI0MTMxQzEuNTM3MDMgMi4wNjU4OSAxLjYzMTk5IDEuOTA0NjkgMS43NTY3OSAxLjc2Nzk3QzEuODgxNTkgMS42MzEyNiAyLjAzMzQ4IDEuNTIyMDMgMi4yMDI4MSAxLjQ0NzI0QzIuMzcyMTMgMS4zNzI0NSAyLjU1NTE3IDEuMzMzNzQgMi43NDAyOCAxLjMzMzU2SDQuNzQwMjhDNS4wNjM4MiAxLjMzMDM4IDUuMzc3NDggMS40NDQ5NSA1LjYyMjc5IDEuNjU1OTJDNS44NjgxIDEuODY2ODkgNi4wMjgzMyAyLjE1OTg2IDYuMDczNjEgMi40ODAyM0M2LjE1ODAzIDMuMTIwMjcgNi4zMTQ1OCAzLjc0ODcxIDYuNTQwMjggNC4zNTM1NkM2LjYyOTk4IDQuNTkyMTggNi42NDkzOSA0Ljg1MTUgNi41OTYyMiA1LjEwMDgxQzYuNTQzMDUgNS4zNTAxMiA2LjQxOTUyIDUuNTc4OTcgNi4yNDAyOCA1Ljc2MDIzTDUuMzkzNjEgNi42MDY4OUM2LjM0MjY1IDguMjc1OTIgNy43MjQ1OCA5LjY1Nzg2IDkuMzkzNjEgMTAuNjA2OUwxMC4yNDAzIDkuNzYwMjNDMTAuNDIxNSA5LjU4MDk5IDEwLjY1MDQgOS40NTc0NiAxMC44OTk3IDkuNDA0MjlDMTEuMTQ5IDkuMzUxMTIgMTEuNDA4MyA5LjM3MDUzIDExLjY0NjkgOS40NjAyM0MxMi4yNTE4IDkuNjg1OTMgMTIuODgwMiA5Ljg0MjQ4IDEzLjUyMDMgOS45MjY4OUMxMy44NDQxIDkuOTcyNTggMTQuMTM5OSAxMC4xMzU3IDE0LjM1MTMgMTAuMzg1MkMxNC41NjI3IDEwLjYzNDggMTQuNjc1MSAxMC45NTMzIDE0LjY2NjkgMTEuMjgwMloiIHN0cm9rZT0iIzMzODVGRiIgc3Ryb2tlLXdpZHRoPSIxLjMzMzMzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF81NjM5XzYzMiI+CjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K";
const guestIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5IDIxVjE5QzE5IDE3LjkzOTEgMTguNTc4NiAxNi45MjE3IDE3LjgyODQgMTYuMTcxNkMxNy4wNzgzIDE1LjQyMTQgMTYuMDYwOSAxNSAxNSAxNUg5QzcuOTM5MTMgMTUgNi45MjE3MiAxNS40MjE0IDYuMTcxNTcgMTYuMTcxNkM1LjQyMTQzIDE2LjkyMTcgNSAxNy45MzkxIDUgMTlWMjEiIHN0cm9rZT0iIzMzODVGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEyIDExQzE0LjIwOTEgMTEgMTYgOS4yMDkxNCAxNiA3QzE2IDQuNzkwODYgMTQuMjA5MSAzIDEyIDNDOS43OTA4NiAzIDggNC43OTA4NiA4IDdDOCA5LjIwOTE0IDkuNzkwODYgMTEgMTIgMTFaIiBzdHJva2U9IiMzMzg1RkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=";
const passkeyIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzU2MzlfMzIpIj4KPHBhdGggZD0iTTcuOTk5NTkgNi42NjY1QzcuNjQ1OTYgNi42NjY1IDcuMzA2ODMgNi44MDY5OCA3LjA1Njc4IDcuMDU3MDNDNi44MDY3MyA3LjMwNzA4IDYuNjY2MjUgNy42NDYyMiA2LjY2NjI1IDcuOTk5ODRDNi42NjYyNSA4LjY3OTg0IDYuNTk5NTkgOS42NzMxNyA2LjQ5MjkyIDEwLjY2NjUiIHN0cm9rZT0iIzMzODVGRiIgc3Ryb2tlLXdpZHRoPSIxLjI1NDkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOS4zMzI5MyA4Ljc0NjU4QzkuMzMyOTMgMTAuMzMzMiA5LjMzMjkzIDEyLjk5OTkgOC42NjYyNiAxNC42NjY2IiBzdHJva2U9IiMzMzg1RkYiIHN0cm9rZS13aWR0aD0iMS4yNTQ5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTExLjUyNzMgMTQuMDEzM0MxMS42MDczIDEzLjYxMzMgMTEuODE0IDEyLjQ4IDExLjg2MDcgMTIiIHN0cm9rZT0iIzMzODVGRiIgc3Ryb2tlLXdpZHRoPSIxLjI1NDkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMS4zMzM5OCA4LjAwMDE2QzEuMzMzOTggNi42MDA5NSAxLjc3NDIzIDUuMjM3MiAyLjU5MjM3IDQuMTAyMDlDMy40MTA1MSAyLjk2Njk5IDQuNTY1MDUgMi4xMTgwOCA1Ljg5MjQ3IDEuNjc1NjFDNy4yMTk4OCAxLjIzMzE0IDguNjUyODYgMS4yMTk1NCA5Ljk4ODQ0IDEuNjM2NzRDMTEuMzI0IDIuMDUzOTQgMTIuNDk0NSAyLjg4MDc5IDEzLjMzNCA0LjAwMDE2IiBzdHJva2U9IiMzMzg1RkYiIHN0cm9rZS13aWR0aD0iMS4yNTQ5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEuMzMzOTggMTAuNjY2NUgxLjMzOTE0IiBzdHJva2U9IiMzMzg1RkYiIHN0cm9rZS13aWR0aD0iMS4yNTQ5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE0LjUzMjcgMTAuNjY2NUMxNC42NjYgOS4zMzMxNyAxNC42MiA3LjA5NzE3IDE0LjUzMjcgNi42NjY1IiBzdHJva2U9IiMzMzg1RkYiIHN0cm9rZS13aWR0aD0iMS4yNTQ5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTMuMzMzOTggMTIuOTk5OEMzLjY2NzMyIDExLjk5OTggNC4wMDA2NSA5Ljk5OTg0IDQuMDAwNjUgNy45OTk4NEMzLjk5OTk4IDcuNTQ1NzUgNC4wNzY2MyA3LjA5NDg2IDQuMjI3MzIgNi42NjY1IiBzdHJva2U9IiMzMzg1RkYiIHN0cm9rZS13aWR0aD0iMS4yNTQ5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTUuNzY3MDkgMTQuNjY2OEM1LjkwNzA5IDE0LjIyNjggNi4wNjcwOSAxMy43ODY4IDYuMTQ3MDkgMTMuMzMzNSIgc3Ryb2tlPSIjMzM4NUZGIiBzdHJva2Utd2lkdGg9IjEuMjU0OSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik02IDQuNTMzNDZDNi42MDgyNyA0LjE4MjI4IDcuMjk4MjggMy45OTc0NSA4LjAwMDY0IDMuOTk3NTZDOC43MDMwMSAzLjk5NzY3IDkuMzkyOTYgNC4xODI3MiAxMC4wMDExIDQuNTM0MUMxMC42MDkzIDQuODg1NDggMTEuMTE0MiA1LjM5MDc5IDExLjQ2NTEgNS45OTkyM0MxMS44MTYgNi42MDc2NiAxMi4wMDA1IDcuMjk3NzYgMTIgOC4wMDAxMlY5LjMzMzQ2IiBzdHJva2U9IiMzMzg1RkYiIHN0cm9rZS13aWR0aD0iMS4yNTQ5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF81NjM5XzMyIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=";

describe("walletIcon", () => {
  it("should return google icon", () => {
    expect(getSocialIcon("google")).toBe(socialIcons.google);
  });

  it("should return coinbase icon", () => {
    expect(getSocialIcon("coinbase")).toBe(socialIcons.coinbase);
  });

  it("should return apple icon", () => {
    expect(getSocialIcon("apple")).toBe(socialIcons.apple);
  });

  it("should return facebook icon", () => {
    expect(getSocialIcon("facebook")).toBe(socialIcons.facebook);
  });

  it("should return phone icon", () => {
    expect(getSocialIcon("phone")).toBe(phoneIcon);
  });

  it("should return email icon", () => {
    expect(getSocialIcon("email")).toBe(emailIcon);
  });

  it("should return passkey icon", () => {
    expect(getSocialIcon("passkey")).toBe(passkeyIcon);
  });

  it("should return discord icon", () => {
    expect(getSocialIcon("discord")).toBe(socialIcons.discord);
  });

  it("should return line icon", () => {
    expect(getSocialIcon("line")).toBe(socialIcons.line);
  });

  it("should return x icon", () => {
    expect(getSocialIcon("x")).toBe(socialIcons.x);
  });

  it("should return farcaster icon", () => {
    expect(getSocialIcon("farcaster")).toBe(socialIcons.farcaster);
  });

  it("should return telegram icon", () => {
    expect(getSocialIcon("telegram")).toBe(socialIcons.telegram);
  });

  it("should return twitch icon", () => {
    expect(getSocialIcon("twitch")).toBe(socialIcons.twitch);
  });

  it("should return github icon", () => {
    expect(getSocialIcon("github")).toBe(socialIcons.github);
  });

  it("should return steam icon", () => {
    expect(getSocialIcon("steam")).toBe(socialIcons.steam);
  });

  it("should return guest icon", () => {
    expect(getSocialIcon("guest")).toBe(guestIcon);
  });

  it("should return generic wallet icon for unknown provider", () => {
    expect(getSocialIcon("unknown")).toBe(genericWalletIcon);
  });
});
