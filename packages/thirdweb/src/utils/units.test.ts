import { describe, expect, it } from "vitest";
import { toTokens, toEther, toUnits, toWei } from "./units.js";

describe("toTokens", () => {
  it("converts value to number", () => {
    expect(toTokens(69n, 0)).toMatchInlineSnapshot('"69"');
    expect(toTokens(69n, 5)).toMatchInlineSnapshot('"0.00069"');
    expect(toTokens(690n, 1)).toMatchInlineSnapshot('"69"');
    expect(toTokens(1300000n, 5)).toMatchInlineSnapshot('"13"');
    expect(toTokens(4200000000000n, 10)).toMatchInlineSnapshot('"420"');
    expect(toTokens(20000000000n, 9)).toMatchInlineSnapshot('"20"');
    expect(toTokens(40000000000000000000n, 18)).toMatchInlineSnapshot('"40"');
    expect(toTokens(10000000000000n, 18)).toMatchInlineSnapshot('"0.00001"');
    expect(toTokens(12345n, 4)).toMatchInlineSnapshot('"1.2345"');
    expect(toTokens(12345n, 4)).toMatchInlineSnapshot('"1.2345"');
    expect(toTokens(6942069420123456789123450000n, 18)).toMatchInlineSnapshot(
      '"6942069420.12345678912345"',
    );
    expect(
      toTokens(
        694212312312306942012345444446789123450000000000000000000000000000000n,
        50,
      ),
    ).toMatchInlineSnapshot('"6942123123123069420.1234544444678912345"');
    expect(toTokens(-690n, 1)).toMatchInlineSnapshot('"-69"');
    expect(toTokens(-1300000n, 5)).toMatchInlineSnapshot('"-13"');
    expect(toTokens(-4200000000000n, 10)).toMatchInlineSnapshot('"-420"');
    expect(toTokens(-20000000000n, 9)).toMatchInlineSnapshot('"-20"');
    expect(toTokens(-40000000000000000000n, 18)).toMatchInlineSnapshot('"-40"');
    expect(toTokens(-12345n, 4)).toMatchInlineSnapshot('"-1.2345"');
    expect(toTokens(-12345n, 4)).toMatchInlineSnapshot('"-1.2345"');
    expect(toTokens(-6942069420123456789123450000n, 18)).toMatchInlineSnapshot(
      '"-6942069420.12345678912345"',
    );
    expect(
      toTokens(
        -694212312312306942012345444446789123450000000000000000000000000000000n,
        50,
      ),
    ).toMatchInlineSnapshot('"-6942123123123069420.1234544444678912345"');
  });
});

describe("toEther", () => {
  it("converts wei to ether", () => {
    expect(toEther(6942069420123456789123450000n)).toMatchInlineSnapshot(
      '"6942069420.12345678912345"',
    );
    expect(toEther(6942069420000000000000000000n)).toMatchInlineSnapshot(
      '"6942069420"',
    );
    expect(toEther(1000000000000000000000000n)).toMatchInlineSnapshot(
      '"1000000"',
    );
    expect(toEther(100000000000000000000000n)).toMatchInlineSnapshot(
      '"100000"',
    );
    expect(toEther(10000000000000000000000n)).toMatchInlineSnapshot('"10000"');
    expect(toEther(1000000000000000000000n)).toMatchInlineSnapshot('"1000"');
    expect(toEther(100000000000000000000n)).toMatchInlineSnapshot('"100"');
    expect(toEther(10000000000000000000n)).toMatchInlineSnapshot('"10"');
    expect(toEther(1000000000000000000n)).toMatchInlineSnapshot('"1"');
    expect(toEther(500000000000000000n)).toMatchInlineSnapshot('"0.5"');
    expect(toEther(100000000000000000n)).toMatchInlineSnapshot('"0.1"');
    expect(toEther(10000000000000000n)).toMatchInlineSnapshot('"0.01"');
    expect(toEther(1000000000000000n)).toMatchInlineSnapshot('"0.001"');
    expect(toEther(100000000000000n)).toMatchInlineSnapshot('"0.0001"');
    expect(toEther(10000000000000n)).toMatchInlineSnapshot('"0.00001"');
    expect(toEther(1000000000000n)).toMatchInlineSnapshot('"0.000001"');
    expect(toEther(100000000000n)).toMatchInlineSnapshot('"0.0000001"');
    expect(toEther(10000000000n)).toMatchInlineSnapshot('"0.00000001"');
    expect(toEther(1000000000n)).toMatchInlineSnapshot('"0.000000001"');
    expect(toEther(100000000n)).toMatchInlineSnapshot('"0.0000000001"');
    expect(toEther(10000000n)).toMatchInlineSnapshot('"0.00000000001"');
    expect(toEther(1000000n)).toMatchInlineSnapshot('"0.000000000001"');
    expect(toEther(100000n)).toMatchInlineSnapshot('"0.0000000000001"');
    expect(toEther(10000n)).toMatchInlineSnapshot('"0.00000000000001"');
    expect(toEther(1000n)).toMatchInlineSnapshot('"0.000000000000001"');
    expect(toEther(100n)).toMatchInlineSnapshot('"0.0000000000000001"');
    expect(toEther(10n)).toMatchInlineSnapshot('"0.00000000000000001"');
    expect(toEther(1n)).toMatchInlineSnapshot('"0.000000000000000001"');
    expect(toEther(0n)).toMatchInlineSnapshot('"0"');
    expect(toEther(-6942069420123456789123450000n)).toMatchInlineSnapshot(
      '"-6942069420.12345678912345"',
    );
    expect(toEther(-6942069420000000000000000000n)).toMatchInlineSnapshot(
      '"-6942069420"',
    );
    expect(toEther(-1000000000000000000n)).toMatchInlineSnapshot('"-1"');
    expect(toEther(-500000000000000000n)).toMatchInlineSnapshot('"-0.5"');
    expect(toEther(-100000000000000000n)).toMatchInlineSnapshot('"-0.1"');
    expect(toEther(-10000000n)).toMatchInlineSnapshot('"-0.00000000001"');
    expect(toEther(-1000000n)).toMatchInlineSnapshot('"-0.000000000001"');
    expect(toEther(-100000n)).toMatchInlineSnapshot('"-0.0000000000001"');
    expect(toEther(-10000n)).toMatchInlineSnapshot('"-0.00000000000001"');
    expect(toEther(-1000n)).toMatchInlineSnapshot('"-0.000000000000001"');
    expect(toEther(-100n)).toMatchInlineSnapshot('"-0.0000000000000001"');
    expect(toEther(-10n)).toMatchInlineSnapshot('"-0.00000000000000001"');
    expect(toEther(-1n)).toMatchInlineSnapshot('"-0.000000000000000001"');
  });
});

describe("toUnits", () => {
  it("converts number to unit of a given length", () => {
    expect(toUnits("69", 1)).toMatchInlineSnapshot("690n");
    expect(toUnits("13", 5)).toMatchInlineSnapshot("1300000n");
    expect(toUnits("420", 10)).toMatchInlineSnapshot("4200000000000n");
    expect(toUnits("20", 9)).toMatchInlineSnapshot("20000000000n");
    expect(toUnits("40", 18)).toMatchInlineSnapshot("40000000000000000000n");
    expect(toUnits("1.2345", 4)).toMatchInlineSnapshot("12345n");
    expect(toUnits("1.0045", 4)).toMatchInlineSnapshot("10045n");
    expect(toUnits("1.2345000", 4)).toMatchInlineSnapshot("12345n");
    expect(toUnits("6942069420.12345678912345", 18)).toMatchInlineSnapshot(
      "6942069420123456789123450000n",
    );
    expect(toUnits("6942069420.00045678912345", 18)).toMatchInlineSnapshot(
      "6942069420000456789123450000n",
    );
    expect(
      toUnits("6942123123123069420.1234544444678912345", 50),
    ).toMatchInlineSnapshot(
      "694212312312306942012345444446789123450000000000000000000000000000000n",
    );
    expect(toUnits("-69", 1)).toMatchInlineSnapshot("-690n");
    expect(toUnits("-1.2345", 4)).toMatchInlineSnapshot("-12345n");
    expect(toUnits("-6942069420.12345678912345", 18)).toMatchInlineSnapshot(
      "-6942069420123456789123450000n",
    );
    expect(
      toUnits("-6942123123123069420.1234544444678912345", 50),
    ).toMatchInlineSnapshot(
      "-694212312312306942012345444446789123450000000000000000000000000000000n",
    );
  });

  it("decimals === 0", () => {
    expect(toUnits("69.2352112312312451512412341231", 0)).toMatchInlineSnapshot(
      "69n",
    );
    expect(toUnits("69.5952141234124125231523412312", 0)).toMatchInlineSnapshot(
      "70n",
    );
    expect(toUnits("12301000000000000020000", 0)).toMatchInlineSnapshot(
      "12301000000000000020000n",
    );
    expect(toUnits("12301000000000000020000.123", 0)).toMatchInlineSnapshot(
      "12301000000000000020000n",
    );
    expect(toUnits("12301000000000000020000.5", 0)).toMatchInlineSnapshot(
      "12301000000000000020001n",
    );
    expect(toUnits("99999999999999999999999.5", 0)).toMatchInlineSnapshot(
      "100000000000000000000000n",
    );
  });

  it("decimals < fraction length", () => {
    expect(toUnits("69.23521", 0)).toMatchInlineSnapshot("69n");
    expect(toUnits("69.56789", 0)).toMatchInlineSnapshot("70n");
    expect(toUnits("69.23521", 1)).toMatchInlineSnapshot("692n");
    expect(toUnits("69.23521", 2)).toMatchInlineSnapshot("6924n");
    expect(toUnits("69.23221", 2)).toMatchInlineSnapshot("6923n");
    expect(toUnits("69.23261", 3)).toMatchInlineSnapshot("69233n");
    expect(toUnits("999999.99999", 3)).toMatchInlineSnapshot("1000000000n");
    expect(toUnits("699999.99999", 3)).toMatchInlineSnapshot("700000000n");
    expect(toUnits("699999.98999", 3)).toMatchInlineSnapshot("699999990n");
    expect(toUnits("699959.99999", 3)).toMatchInlineSnapshot("699960000n");
    expect(toUnits("699099.99999", 3)).toMatchInlineSnapshot("699100000n");
    expect(toUnits("100000.000999", 3)).toMatchInlineSnapshot("100000001n");
    expect(toUnits("100000.990999", 3)).toMatchInlineSnapshot("100000991n");
    expect(toUnits("69.00221", 3)).toMatchInlineSnapshot("69002n");
    expect(toUnits("1.0536059576998882", 7)).toMatchInlineSnapshot("10536060n");
    expect(toUnits("1.0053059576998882", 7)).toMatchInlineSnapshot("10053060n");
    expect(toUnits("1.0000000900000000", 7)).toMatchInlineSnapshot("10000001n");
    expect(toUnits("1.0000009900000000", 7)).toMatchInlineSnapshot("10000010n");
    expect(toUnits("1.0000099900000000", 7)).toMatchInlineSnapshot("10000100n");
    expect(toUnits("1.0000092900000000", 7)).toMatchInlineSnapshot("10000093n");
    expect(toUnits("1.5536059576998882", 7)).toMatchInlineSnapshot("15536060n");
    expect(toUnits("1.0536059476998882", 7)).toMatchInlineSnapshot("10536059n");
    expect(toUnits("1.4545454545454545", 7)).toMatchInlineSnapshot("14545455n");
    expect(toUnits("1.1234567891234567", 7)).toMatchInlineSnapshot("11234568n");
    expect(toUnits("1.8989898989898989", 7)).toMatchInlineSnapshot("18989899n");
    expect(toUnits("9.9999999999999999", 7)).toMatchInlineSnapshot(
      "100000000n",
    );
    expect(toUnits("0.0536059576998882", 7)).toMatchInlineSnapshot("536060n");
    expect(toUnits("0.0053059576998882", 7)).toMatchInlineSnapshot("53060n");
    expect(toUnits("0.0000000900000000", 7)).toMatchInlineSnapshot("1n");
    expect(toUnits("0.0000009900000000", 7)).toMatchInlineSnapshot("10n");
    expect(toUnits("0.0000099900000000", 7)).toMatchInlineSnapshot("100n");
    expect(toUnits("0.0000092900000000", 7)).toMatchInlineSnapshot("93n");
    expect(toUnits("0.0999999999999999", 7)).toMatchInlineSnapshot("1000000n");
    expect(toUnits("0.0099999999999999", 7)).toMatchInlineSnapshot("100000n");
    expect(toUnits("0.00000000059", 9)).toMatchInlineSnapshot("1n");
    expect(toUnits("0.0000000003", 9)).toMatchInlineSnapshot("0n");
    expect(toUnits("69.00000000000", 9)).toMatchInlineSnapshot("69000000000n");
    expect(toUnits("69.00000000019", 9)).toMatchInlineSnapshot("69000000000n");
    expect(toUnits("69.00000000059", 9)).toMatchInlineSnapshot("69000000001n");
    expect(toUnits("69.59000000059", 9)).toMatchInlineSnapshot("69590000001n");
    expect(toUnits("69.59000002359", 9)).toMatchInlineSnapshot("69590000024n");
  });
});

describe("toWei", () => {
  it("converts ether to wei", () => {
    expect(toWei("6942069420.12345678912345")).toMatchInlineSnapshot(
      "6942069420123456789123450000n",
    );
    expect(toWei("6942069420")).toMatchInlineSnapshot(
      "6942069420000000000000000000n",
    );
    expect(toWei("1")).toMatchInlineSnapshot("1000000000000000000n");
    expect(toWei("0.5")).toMatchInlineSnapshot("500000000000000000n");
    expect(toWei("0.1")).toMatchInlineSnapshot("100000000000000000n");
    expect(toWei("0.01")).toMatchInlineSnapshot("10000000000000000n");
    expect(toWei("0.001")).toMatchInlineSnapshot("1000000000000000n");
    expect(toWei("0.0001")).toMatchInlineSnapshot("100000000000000n");
    expect(toWei("0.00001")).toMatchInlineSnapshot("10000000000000n");
    expect(toWei("0.00000000001")).toMatchInlineSnapshot("10000000n");
    expect(toWei("0.000000000001")).toMatchInlineSnapshot("1000000n");
    expect(toWei("0.0000000000001")).toMatchInlineSnapshot("100000n");
    expect(toWei("0.00000000000001")).toMatchInlineSnapshot("10000n");
    expect(toWei("0.000000000000001")).toMatchInlineSnapshot("1000n");
    expect(toWei("0.0000000000000001")).toMatchInlineSnapshot("100n");
    expect(toWei("0.00000000000000001")).toMatchInlineSnapshot("10n");
    expect(toWei("0.000000000000000001")).toMatchInlineSnapshot("1n");
    expect(toWei("-6942069420.12345678912345")).toMatchInlineSnapshot(
      "-6942069420123456789123450000n",
    );
    expect(toWei("-6942069420")).toMatchInlineSnapshot(
      "-6942069420000000000000000000n",
    );
    expect(toWei("-1")).toMatchInlineSnapshot("-1000000000000000000n");
    expect(toWei("-0.5")).toMatchInlineSnapshot("-500000000000000000n");
    expect(toWei("-0.1")).toMatchInlineSnapshot("-100000000000000000n");
    expect(toWei("-0.00000000001")).toMatchInlineSnapshot("-10000000n");
    expect(toWei("-0.000000000001")).toMatchInlineSnapshot("-1000000n");
    expect(toWei("-0.0000000000001")).toMatchInlineSnapshot("-100000n");
    expect(toWei("-0.00000000000001")).toMatchInlineSnapshot("-10000n");
    expect(toWei("-0.000000000000001")).toMatchInlineSnapshot("-1000n");
    expect(toWei("-0.0000000000000001")).toMatchInlineSnapshot("-100n");
    expect(toWei("-0.00000000000000001")).toMatchInlineSnapshot("-10n");
    expect(toWei("-0.000000000000000001")).toMatchInlineSnapshot("-1n");
  });

  it("converts to rounded wei", () => {
    expect(toWei("0.0000000000000000001")).toMatchInlineSnapshot("0n");
    expect(toWei("0.00000000000000000059")).toMatchInlineSnapshot("1n");
    expect(toWei("1.00000000000000000059")).toMatchInlineSnapshot(
      "1000000000000000001n",
    );
    expect(toWei("69.59000000000000000059")).toMatchInlineSnapshot(
      "69590000000000000001n",
    );
    expect(toWei("1.2345678000000000912345222")).toMatchInlineSnapshot(
      "1234567800000000091n",
    );
    expect(toWei("-0.0000000000000000001")).toMatchInlineSnapshot("0n");
    expect(toWei("-0.00000000000000000059")).toMatchInlineSnapshot("-1n");
    expect(toWei("-1.00000000000000000059")).toMatchInlineSnapshot(
      "-1000000000000000001n",
    );
    expect(toWei("-69.59000000000000000059")).toMatchInlineSnapshot(
      "-69590000000000000001n",
    );
    expect(toWei("-1.2345678000000000912345222")).toMatchInlineSnapshot(
      "-1234567800000000091n",
    );
  });
});
