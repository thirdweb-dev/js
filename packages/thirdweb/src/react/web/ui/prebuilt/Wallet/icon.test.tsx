import { describe, expect, it } from "vitest";
import { render, waitFor } from "~test/react-render.js";
import { WalletIcon, fetchWalletImage } from "./icon.js";
import { WalletProvider } from "./provider.js";

describe("WalletIcon", () => {
  it("should fetch wallet image", async () => {
    expect(await fetchWalletImage({ id: "io.metamask" })).toBe(
      "data:image/webp;base64,UklGRsgFAABXRUJQVlA4ILwFAAAwHgCdASqAAIAAPm0ylEWkIyIXTGzMQAbEoAzQSPDffG8qhx7LpfeDUfnDee/tP6gP2u9Yf0a/7L0/+pc3nivc0JlTXBvMVYW1Wt7JbdRJ1a5UhpH9+sdhAvGug20WzG+wRD+P/7/raQ1NqZ5EfcOwosQsP7NRVflPNArBLCbFJWE3EvTLNOmMfR2f+r+E2y6y1lWanc3n9RtF4lYbcW38t3UG/W2jXng4loXFOy3Vjm/r/1KHwXlpAuhAIzK/XF+ChayRFhBD+lbRrgQ3CSVjdmXw6agYPoMQ+tpjPUN/3qdGcvnN1sKWt57OGozQVSjMu0aA58MPKVWiAP77l9VfptKhZ7in3+r1DqZZQEYqO1p+MENah/WS/QQDvPuew8P0OXfahcjbCg7h4QEEEjDyfoFUbQHdw+meAsydryxVs/Ij+eB619Uj/sMgtwIifIyTieCT/hdsDmpLqGD+vOIArZfzSkordRkngojxVgvWRht84IaCHCs5Dn208UHFmyQE4KCxHef1iLYeAEPxnIAovGHIl7rCjiYE12obAM3ZCnt+RFqcT3q2rorCswc4/8f8TOhCSo63/dszpMkNQonGwtyhAFnm1EKqLPDcy99ggKQL95VYePoHcv8sHOG5zJ7lircX7VPpxkloNVWnlp/drJjQrp0h5BsOnqYn756+wcFw5qapAOnYCKUHujsoSz2BlLs1702rFpvi1iVczo2aO9GN1TaM3zBqMX0NN0YEU8pz/3+xwkK5M5q+Qb4FNJeugjdOp2kcYoOCbyAg/0OyGswYHPwDN/opVaDHWj0FcKzLq43uEjUZMG8t7O6BkoK0FmpYOeTQrinuF5F6W6ENly78daVmGPYTU22R9No5+xr8F2ESYTaJzOR3UoouY15xHrsxhDCukfebOiHljS6jUjF0TWaIAb58k57DZ3gdjkpxnJDyEmCsCOlASNWMn1ay3G8PDriQOdwsL7bgx/jZXN6XZHVx2hst/6Qcljnnn4um8eD1NcP1rTV7HMZzAb/d7ntki9zU1IFl695zPs3YT+h0PS4JuQYLzYoxpmMUQ35sVx/3KkL4Pm/TlvuNpnopM0+l2b/0OS6+5GwJYEMpzM4peYZS3qZkz/kxWNPTLv3UcCguDqpGxZ39l/VQJhSImKPZBa1RWCtSj29VCzCEZlX/eAdAKgZwhMKR4C5osznEbxjfRdHHPxjZwstCwugFa5w/WykOTFGAzk0sLSuvxO9kw/f++0WvG5La11GQaqbDDJ/ks7bcELqEGtvLHiJgxOXW9PqCk5Ap9EYelPTmdhHZgzWxtz4idN+JX+DGyYtJYjtW+Ay4kJ4Hol+Iavfje1f/22S69z1XSZ8OOcrDHKQdO1JlGaTkKQmCg5Tr05Qy9NQSfh67Vpui6OyMu38BnbG+cfWPRx/MjGQITY8w8sb1GUGd5hD9eVqycVtz8yFlYrXYQSBkAxMYgkBaiWe6kk24SoOCgt74nNs3pyTWUERw9ENESB6PyO9HjcsUZWIh97RKlf6thPtqxdlfr9i3McON9zvI7M2TtYcneXhOnqN8V4wqqII2J3DQ6/DZFNj5eNkCp2ijt7UWuKduhEmbZlLahfxD8eqBHAZR/H5rulzc4oVlyXr6qPXf9LCEuDRSDE8VNFY4NuTcaRTZO33RrWmWzbXAwpEKeH/Xf78XMoeynLBSyB+pS6y8Fqh7ExdmnvtW2gW3pwNrLc5lXlZJW8VcBzaSpy1Dmqj6Xll9BS8RyWqNx0O3fY8NJpf1exbNYMWA8juddzn2d9lHypEbiym0ASxI/jgGkbis5fecZ60QtJusJgdC8HAJEh64A9EuOCAnnISc5CElwpsvJTdEZhYv3t7MtLDvHp20lAtylt5l9yxqfCy/sqC6qZ/8+tsTAHzziGF6NKoaD0FVhZ2CER5AonJdBz5sg0rcD7arFe96uzujFDCQAAAA",
    );
  });

  it("should throw error if WalletId is not supported", async () => {
    await expect(() =>
      // @ts-ignore For test
      fetchWalletImage({ id: "__undefined__" }),
    ).rejects.toThrowError("Wallet with id __undefined__ not found");
  });

  it("should render an image", async () => {
    const { container } = render(
      <WalletProvider id="io.cosmostation">
        <WalletIcon />
      </WalletProvider>,
    );
    await waitFor(() => {
      expect(container.querySelector("img")).not.toBe(null);
    });
  });
});
