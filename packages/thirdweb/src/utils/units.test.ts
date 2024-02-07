import { describe, expect, it } from "vitest";
import {
  formatUnits,
  formatEther,
  formatGwei,
  parseUnits,
  parseEther,
  parseGwei,
} from "./units.js";

describe("formatUnits", () => {
  it("converts value to number", () => {
    expect(formatUnits(69n, 0)).toMatchInlineSnapshot('"69"');
    expect(formatUnits(69n, 5)).toMatchInlineSnapshot('"0.00069"');
    expect(formatUnits(690n, 1)).toMatchInlineSnapshot('"69"');
    expect(formatUnits(1300000n, 5)).toMatchInlineSnapshot('"13"');
    expect(formatUnits(4200000000000n, 10)).toMatchInlineSnapshot('"420"');
    expect(formatUnits(20000000000n, 9)).toMatchInlineSnapshot('"20"');
    expect(formatUnits(40000000000000000000n, 18)).toMatchInlineSnapshot(
      '"40"',
    );
    expect(formatUnits(10000000000000n, 18)).toMatchInlineSnapshot('"0.00001"');
    expect(formatUnits(12345n, 4)).toMatchInlineSnapshot('"1.2345"');
    expect(formatUnits(12345n, 4)).toMatchInlineSnapshot('"1.2345"');
    expect(
      formatUnits(6942069420123456789123450000n, 18),
    ).toMatchInlineSnapshot('"6942069420.12345678912345"');
    expect(
      formatUnits(
        694212312312306942012345444446789123450000000000000000000000000000000n,
        50,
      ),
    ).toMatchInlineSnapshot('"6942123123123069420.1234544444678912345"');
    expect(formatUnits(-690n, 1)).toMatchInlineSnapshot('"-69"');
    expect(formatUnits(-1300000n, 5)).toMatchInlineSnapshot('"-13"');
    expect(formatUnits(-4200000000000n, 10)).toMatchInlineSnapshot('"-420"');
    expect(formatUnits(-20000000000n, 9)).toMatchInlineSnapshot('"-20"');
    expect(formatUnits(-40000000000000000000n, 18)).toMatchInlineSnapshot(
      '"-40"',
    );
    expect(formatUnits(-12345n, 4)).toMatchInlineSnapshot('"-1.2345"');
    expect(formatUnits(-12345n, 4)).toMatchInlineSnapshot('"-1.2345"');
    expect(
      formatUnits(-6942069420123456789123450000n, 18),
    ).toMatchInlineSnapshot('"-6942069420.12345678912345"');
    expect(
      formatUnits(
        -694212312312306942012345444446789123450000000000000000000000000000000n,
        50,
      ),
    ).toMatchInlineSnapshot('"-6942123123123069420.1234544444678912345"');
  });
});

describe("formatEther", () => {
  it("converts wei to ether", () => {
    expect(formatEther(6942069420123456789123450000n)).toMatchInlineSnapshot(
      '"6942069420.12345678912345"',
    );
    expect(formatEther(6942069420000000000000000000n)).toMatchInlineSnapshot(
      '"6942069420"',
    );
    expect(formatEther(1000000000000000000000000n)).toMatchInlineSnapshot(
      '"1000000"',
    );
    expect(formatEther(100000000000000000000000n)).toMatchInlineSnapshot(
      '"100000"',
    );
    expect(formatEther(10000000000000000000000n)).toMatchInlineSnapshot(
      '"10000"',
    );
    expect(formatEther(1000000000000000000000n)).toMatchInlineSnapshot(
      '"1000"',
    );
    expect(formatEther(100000000000000000000n)).toMatchInlineSnapshot('"100"');
    expect(formatEther(10000000000000000000n)).toMatchInlineSnapshot('"10"');
    expect(formatEther(1000000000000000000n)).toMatchInlineSnapshot('"1"');
    expect(formatEther(500000000000000000n)).toMatchInlineSnapshot('"0.5"');
    expect(formatEther(100000000000000000n)).toMatchInlineSnapshot('"0.1"');
    expect(formatEther(10000000000000000n)).toMatchInlineSnapshot('"0.01"');
    expect(formatEther(1000000000000000n)).toMatchInlineSnapshot('"0.001"');
    expect(formatEther(100000000000000n)).toMatchInlineSnapshot('"0.0001"');
    expect(formatEther(10000000000000n)).toMatchInlineSnapshot('"0.00001"');
    expect(formatEther(1000000000000n)).toMatchInlineSnapshot('"0.000001"');
    expect(formatEther(100000000000n)).toMatchInlineSnapshot('"0.0000001"');
    expect(formatEther(10000000000n)).toMatchInlineSnapshot('"0.00000001"');
    expect(formatEther(1000000000n)).toMatchInlineSnapshot('"0.000000001"');
    expect(formatEther(100000000n)).toMatchInlineSnapshot('"0.0000000001"');
    expect(formatEther(10000000n)).toMatchInlineSnapshot('"0.00000000001"');
    expect(formatEther(1000000n)).toMatchInlineSnapshot('"0.000000000001"');
    expect(formatEther(100000n)).toMatchInlineSnapshot('"0.0000000000001"');
    expect(formatEther(10000n)).toMatchInlineSnapshot('"0.00000000000001"');
    expect(formatEther(1000n)).toMatchInlineSnapshot('"0.000000000000001"');
    expect(formatEther(100n)).toMatchInlineSnapshot('"0.0000000000000001"');
    expect(formatEther(10n)).toMatchInlineSnapshot('"0.00000000000000001"');
    expect(formatEther(1n)).toMatchInlineSnapshot('"0.000000000000000001"');
    expect(formatEther(0n)).toMatchInlineSnapshot('"0"');
    expect(formatEther(-6942069420123456789123450000n)).toMatchInlineSnapshot(
      '"-6942069420.12345678912345"',
    );
    expect(formatEther(-6942069420000000000000000000n)).toMatchInlineSnapshot(
      '"-6942069420"',
    );
    expect(formatEther(-1000000000000000000n)).toMatchInlineSnapshot('"-1"');
    expect(formatEther(-500000000000000000n)).toMatchInlineSnapshot('"-0.5"');
    expect(formatEther(-100000000000000000n)).toMatchInlineSnapshot('"-0.1"');
    expect(formatEther(-10000000n)).toMatchInlineSnapshot('"-0.00000000001"');
    expect(formatEther(-1000000n)).toMatchInlineSnapshot('"-0.000000000001"');
    expect(formatEther(-100000n)).toMatchInlineSnapshot('"-0.0000000000001"');
    expect(formatEther(-10000n)).toMatchInlineSnapshot('"-0.00000000000001"');
    expect(formatEther(-1000n)).toMatchInlineSnapshot('"-0.000000000000001"');
    expect(formatEther(-100n)).toMatchInlineSnapshot('"-0.0000000000000001"');
    expect(formatEther(-10n)).toMatchInlineSnapshot('"-0.00000000000000001"');
    expect(formatEther(-1n)).toMatchInlineSnapshot('"-0.000000000000000001"');
  });

  it("converts gwei to ether", () => {
    expect(formatEther(69420123456700n, "gwei")).toMatchInlineSnapshot(
      '"69420.1234567"',
    );
    expect(formatEther(69420000000000n, "gwei")).toMatchInlineSnapshot(
      '"69420"',
    );
    expect(formatEther(1000000000n, "gwei")).toMatchInlineSnapshot('"1"');
    expect(formatEther(500000000n, "gwei")).toMatchInlineSnapshot('"0.5"');
    expect(formatEther(100000000n, "gwei")).toMatchInlineSnapshot('"0.1"');
    expect(formatEther(10000000n, "gwei")).toMatchInlineSnapshot('"0.01"');
    expect(formatEther(1000000n, "gwei")).toMatchInlineSnapshot('"0.001"');
    expect(formatEther(100000n, "gwei")).toMatchInlineSnapshot('"0.0001"');
    expect(formatEther(10000n, "gwei")).toMatchInlineSnapshot('"0.00001"');
    expect(formatEther(1000n, "gwei")).toMatchInlineSnapshot('"0.000001"');
    expect(formatEther(100n, "gwei")).toMatchInlineSnapshot('"0.0000001"');
    expect(formatEther(10n, "gwei")).toMatchInlineSnapshot('"0.00000001"');
    expect(formatEther(1n, "gwei")).toMatchInlineSnapshot('"0.000000001"');
    expect(formatEther(-69420123456700n, "gwei")).toMatchInlineSnapshot(
      '"-69420.1234567"',
    );
    expect(formatEther(-69420000000000n, "gwei")).toMatchInlineSnapshot(
      '"-69420"',
    );
    expect(formatEther(-1000000000n, "gwei")).toMatchInlineSnapshot('"-1"');
    expect(formatEther(-500000000n, "gwei")).toMatchInlineSnapshot('"-0.5"');
    expect(formatEther(-100000000n, "gwei")).toMatchInlineSnapshot('"-0.1"');
    expect(formatEther(-10000000n, "gwei")).toMatchInlineSnapshot('"-0.01"');
    expect(formatEther(-1000000n, "gwei")).toMatchInlineSnapshot('"-0.001"');
    expect(formatEther(-100000n, "gwei")).toMatchInlineSnapshot('"-0.0001"');
    expect(formatEther(-10000n, "gwei")).toMatchInlineSnapshot('"-0.00001"');
    expect(formatEther(-1000n, "gwei")).toMatchInlineSnapshot('"-0.000001"');
    expect(formatEther(-100n, "gwei")).toMatchInlineSnapshot('"-0.0000001"');
    expect(formatEther(-10n, "gwei")).toMatchInlineSnapshot('"-0.00000001"');
    expect(formatEther(-1n, "gwei")).toMatchInlineSnapshot('"-0.000000001"');
  });
});

describe("formatGwei", () => {
  it("converts wei to gwei", () => {
    expect(formatGwei(69420123456700n)).toMatchInlineSnapshot(
      '"69420.1234567"',
    );
    expect(formatGwei(69420000000000n)).toMatchInlineSnapshot('"69420"');
    expect(formatGwei(1000000000n)).toMatchInlineSnapshot('"1"');
    expect(formatGwei(500000000n)).toMatchInlineSnapshot('"0.5"');
    expect(formatGwei(100000000n)).toMatchInlineSnapshot('"0.1"');
    expect(formatGwei(10000000n)).toMatchInlineSnapshot('"0.01"');
    expect(formatGwei(1000000n)).toMatchInlineSnapshot('"0.001"');
    expect(formatGwei(100000n)).toMatchInlineSnapshot('"0.0001"');
    expect(formatGwei(10000n)).toMatchInlineSnapshot('"0.00001"');
    expect(formatGwei(1000n)).toMatchInlineSnapshot('"0.000001"');
    expect(formatGwei(100n)).toMatchInlineSnapshot('"0.0000001"');
    expect(formatGwei(10n)).toMatchInlineSnapshot('"0.00000001"');
    expect(formatGwei(1n)).toMatchInlineSnapshot('"0.000000001"');
    expect(formatGwei(-69420123456700n)).toMatchInlineSnapshot(
      '"-69420.1234567"',
    );
    expect(formatGwei(-69420000000000n)).toMatchInlineSnapshot('"-69420"');
    expect(formatGwei(-1000000000n)).toMatchInlineSnapshot('"-1"');
    expect(formatGwei(-500000000n)).toMatchInlineSnapshot('"-0.5"');
    expect(formatGwei(-100000000n)).toMatchInlineSnapshot('"-0.1"');
    expect(formatGwei(-10000000n)).toMatchInlineSnapshot('"-0.01"');
    expect(formatGwei(-1000000n)).toMatchInlineSnapshot('"-0.001"');
    expect(formatGwei(-100000n)).toMatchInlineSnapshot('"-0.0001"');
    expect(formatGwei(-10000n)).toMatchInlineSnapshot('"-0.00001"');
    expect(formatGwei(-1000n)).toMatchInlineSnapshot('"-0.000001"');
    expect(formatGwei(-100n)).toMatchInlineSnapshot('"-0.0000001"');
    expect(formatGwei(-10n)).toMatchInlineSnapshot('"-0.00000001"');
    expect(formatGwei(-1n)).toMatchInlineSnapshot('"-0.000000001"');
  });
});

describe("parseUnits", () => {
  it("converts number to unit of a given length", () => {
    expect(parseUnits("69", 1)).toMatchInlineSnapshot("690n");
    expect(parseUnits("13", 5)).toMatchInlineSnapshot("1300000n");
    expect(parseUnits("420", 10)).toMatchInlineSnapshot("4200000000000n");
    expect(parseUnits("20", 9)).toMatchInlineSnapshot("20000000000n");
    expect(parseUnits("40", 18)).toMatchInlineSnapshot("40000000000000000000n");
    expect(parseUnits("1.2345", 4)).toMatchInlineSnapshot("12345n");
    expect(parseUnits("1.0045", 4)).toMatchInlineSnapshot("10045n");
    expect(parseUnits("1.2345000", 4)).toMatchInlineSnapshot("12345n");
    expect(parseUnits("6942069420.12345678912345", 18)).toMatchInlineSnapshot(
      "6942069420123456789123450000n",
    );
    expect(parseUnits("6942069420.00045678912345", 18)).toMatchInlineSnapshot(
      "6942069420000456789123450000n",
    );
    expect(
      parseUnits("6942123123123069420.1234544444678912345", 50),
    ).toMatchInlineSnapshot(
      "694212312312306942012345444446789123450000000000000000000000000000000n",
    );
    expect(parseUnits("-69", 1)).toMatchInlineSnapshot("-690n");
    expect(parseUnits("-1.2345", 4)).toMatchInlineSnapshot("-12345n");
    expect(parseUnits("-6942069420.12345678912345", 18)).toMatchInlineSnapshot(
      "-6942069420123456789123450000n",
    );
    expect(
      parseUnits("-6942123123123069420.1234544444678912345", 50),
    ).toMatchInlineSnapshot(
      "-694212312312306942012345444446789123450000000000000000000000000000000n",
    );
  });

  it("decimals === 0", () => {
    expect(
      parseUnits("69.2352112312312451512412341231", 0),
    ).toMatchInlineSnapshot("69n");
    expect(
      parseUnits("69.5952141234124125231523412312", 0),
    ).toMatchInlineSnapshot("70n");
    expect(parseUnits("12301000000000000020000", 0)).toMatchInlineSnapshot(
      "12301000000000000020000n",
    );
    expect(parseUnits("12301000000000000020000.123", 0)).toMatchInlineSnapshot(
      "12301000000000000020000n",
    );
    expect(parseUnits("12301000000000000020000.5", 0)).toMatchInlineSnapshot(
      "12301000000000000020001n",
    );
    expect(parseUnits("99999999999999999999999.5", 0)).toMatchInlineSnapshot(
      "100000000000000000000000n",
    );
  });

  it("decimals < fraction length", () => {
    expect(parseUnits("69.23521", 0)).toMatchInlineSnapshot("69n");
    expect(parseUnits("69.56789", 0)).toMatchInlineSnapshot("70n");
    expect(parseUnits("69.23521", 1)).toMatchInlineSnapshot("692n");
    expect(parseUnits("69.23521", 2)).toMatchInlineSnapshot("6924n");
    expect(parseUnits("69.23221", 2)).toMatchInlineSnapshot("6923n");
    expect(parseUnits("69.23261", 3)).toMatchInlineSnapshot("69233n");
    expect(parseUnits("999999.99999", 3)).toMatchInlineSnapshot("1000000000n");
    expect(parseUnits("699999.99999", 3)).toMatchInlineSnapshot("700000000n");
    expect(parseUnits("699999.98999", 3)).toMatchInlineSnapshot("699999990n");
    expect(parseUnits("699959.99999", 3)).toMatchInlineSnapshot("699960000n");
    expect(parseUnits("699099.99999", 3)).toMatchInlineSnapshot("699100000n");
    expect(parseUnits("100000.000999", 3)).toMatchInlineSnapshot("100000001n");
    expect(parseUnits("100000.990999", 3)).toMatchInlineSnapshot("100000991n");
    expect(parseUnits("69.00221", 3)).toMatchInlineSnapshot("69002n");
    expect(parseUnits("1.0536059576998882", 7)).toMatchInlineSnapshot(
      "10536060n",
    );
    expect(parseUnits("1.0053059576998882", 7)).toMatchInlineSnapshot(
      "10053060n",
    );
    expect(parseUnits("1.0000000900000000", 7)).toMatchInlineSnapshot(
      "10000001n",
    );
    expect(parseUnits("1.0000009900000000", 7)).toMatchInlineSnapshot(
      "10000010n",
    );
    expect(parseUnits("1.0000099900000000", 7)).toMatchInlineSnapshot(
      "10000100n",
    );
    expect(parseUnits("1.0000092900000000", 7)).toMatchInlineSnapshot(
      "10000093n",
    );
    expect(parseUnits("1.5536059576998882", 7)).toMatchInlineSnapshot(
      "15536060n",
    );
    expect(parseUnits("1.0536059476998882", 7)).toMatchInlineSnapshot(
      "10536059n",
    );
    expect(parseUnits("1.4545454545454545", 7)).toMatchInlineSnapshot(
      "14545455n",
    );
    expect(parseUnits("1.1234567891234567", 7)).toMatchInlineSnapshot(
      "11234568n",
    );
    expect(parseUnits("1.8989898989898989", 7)).toMatchInlineSnapshot(
      "18989899n",
    );
    expect(parseUnits("9.9999999999999999", 7)).toMatchInlineSnapshot(
      "100000000n",
    );
    expect(parseUnits("0.0536059576998882", 7)).toMatchInlineSnapshot(
      "536060n",
    );
    expect(parseUnits("0.0053059576998882", 7)).toMatchInlineSnapshot("53060n");
    expect(parseUnits("0.0000000900000000", 7)).toMatchInlineSnapshot("1n");
    expect(parseUnits("0.0000009900000000", 7)).toMatchInlineSnapshot("10n");
    expect(parseUnits("0.0000099900000000", 7)).toMatchInlineSnapshot("100n");
    expect(parseUnits("0.0000092900000000", 7)).toMatchInlineSnapshot("93n");
    expect(parseUnits("0.0999999999999999", 7)).toMatchInlineSnapshot(
      "1000000n",
    );
    expect(parseUnits("0.0099999999999999", 7)).toMatchInlineSnapshot(
      "100000n",
    );
    expect(parseUnits("0.00000000059", 9)).toMatchInlineSnapshot("1n");
    expect(parseUnits("0.0000000003", 9)).toMatchInlineSnapshot("0n");
    expect(parseUnits("69.00000000000", 9)).toMatchInlineSnapshot(
      "69000000000n",
    );
    expect(parseUnits("69.00000000019", 9)).toMatchInlineSnapshot(
      "69000000000n",
    );
    expect(parseUnits("69.00000000059", 9)).toMatchInlineSnapshot(
      "69000000001n",
    );
    expect(parseUnits("69.59000000059", 9)).toMatchInlineSnapshot(
      "69590000001n",
    );
    expect(parseUnits("69.59000002359", 9)).toMatchInlineSnapshot(
      "69590000024n",
    );
  });
});

describe("parseEther", () => {
  it("converts ether to wei", () => {
    expect(parseEther("6942069420.12345678912345")).toMatchInlineSnapshot(
      "6942069420123456789123450000n",
    );
    expect(parseEther("6942069420")).toMatchInlineSnapshot(
      "6942069420000000000000000000n",
    );
    expect(parseEther("1")).toMatchInlineSnapshot("1000000000000000000n");
    expect(parseEther("0.5")).toMatchInlineSnapshot("500000000000000000n");
    expect(parseEther("0.1")).toMatchInlineSnapshot("100000000000000000n");
    expect(parseEther("0.01")).toMatchInlineSnapshot("10000000000000000n");
    expect(parseEther("0.001")).toMatchInlineSnapshot("1000000000000000n");
    expect(parseEther("0.0001")).toMatchInlineSnapshot("100000000000000n");
    expect(parseEther("0.00001")).toMatchInlineSnapshot("10000000000000n");
    expect(parseEther("0.00000000001")).toMatchInlineSnapshot("10000000n");
    expect(parseEther("0.000000000001")).toMatchInlineSnapshot("1000000n");
    expect(parseEther("0.0000000000001")).toMatchInlineSnapshot("100000n");
    expect(parseEther("0.00000000000001")).toMatchInlineSnapshot("10000n");
    expect(parseEther("0.000000000000001")).toMatchInlineSnapshot("1000n");
    expect(parseEther("0.0000000000000001")).toMatchInlineSnapshot("100n");
    expect(parseEther("0.00000000000000001")).toMatchInlineSnapshot("10n");
    expect(parseEther("0.000000000000000001")).toMatchInlineSnapshot("1n");
    expect(parseEther("-6942069420.12345678912345")).toMatchInlineSnapshot(
      "-6942069420123456789123450000n",
    );
    expect(parseEther("-6942069420")).toMatchInlineSnapshot(
      "-6942069420000000000000000000n",
    );
    expect(parseEther("-1")).toMatchInlineSnapshot("-1000000000000000000n");
    expect(parseEther("-0.5")).toMatchInlineSnapshot("-500000000000000000n");
    expect(parseEther("-0.1")).toMatchInlineSnapshot("-100000000000000000n");
    expect(parseEther("-0.00000000001")).toMatchInlineSnapshot("-10000000n");
    expect(parseEther("-0.000000000001")).toMatchInlineSnapshot("-1000000n");
    expect(parseEther("-0.0000000000001")).toMatchInlineSnapshot("-100000n");
    expect(parseEther("-0.00000000000001")).toMatchInlineSnapshot("-10000n");
    expect(parseEther("-0.000000000000001")).toMatchInlineSnapshot("-1000n");
    expect(parseEther("-0.0000000000000001")).toMatchInlineSnapshot("-100n");
    expect(parseEther("-0.00000000000000001")).toMatchInlineSnapshot("-10n");
    expect(parseEther("-0.000000000000000001")).toMatchInlineSnapshot("-1n");
  });

  it("converts ether to gwei", () => {
    expect(parseEther("69420.1234567", "gwei")).toMatchInlineSnapshot(
      "69420123456700n",
    );
    expect(parseEther("69420", "gwei")).toMatchInlineSnapshot(
      "69420000000000n",
    );
    expect(parseEther("1", "gwei")).toMatchInlineSnapshot("1000000000n");
    expect(parseEther("0.5", "gwei")).toMatchInlineSnapshot("500000000n");
    expect(parseEther("0.1", "gwei")).toMatchInlineSnapshot("100000000n");
    expect(parseEther("0.01", "gwei")).toMatchInlineSnapshot("10000000n");
    expect(parseEther("0.001", "gwei")).toMatchInlineSnapshot("1000000n");
    expect(parseEther("0.0001", "gwei")).toMatchInlineSnapshot("100000n");
    expect(parseEther("0.00001", "gwei")).toMatchInlineSnapshot("10000n");
    expect(parseEther("0.000001", "gwei")).toMatchInlineSnapshot("1000n");
    expect(parseEther("0.0000001", "gwei")).toMatchInlineSnapshot("100n");
    expect(parseEther("0.00000001", "gwei")).toMatchInlineSnapshot("10n");
    expect(parseEther("0.000000001", "gwei")).toMatchInlineSnapshot("1n");

    expect(parseEther("-6942060.123456", "gwei")).toMatchInlineSnapshot(
      "-6942060123456000n",
    );
    expect(parseEther("-6942069420", "gwei")).toMatchInlineSnapshot(
      "-6942069420000000000n",
    );
    expect(parseEther("-1", "gwei")).toMatchInlineSnapshot("-1000000000n");
    expect(parseEther("-0.5", "gwei")).toMatchInlineSnapshot("-500000000n");
    expect(parseEther("-0.1", "gwei")).toMatchInlineSnapshot("-100000000n");
    expect(parseEther("-0.01", "gwei")).toMatchInlineSnapshot("-10000000n");
    expect(parseEther("-0.001", "gwei")).toMatchInlineSnapshot("-1000000n");
    expect(parseEther("-0.0001", "gwei")).toMatchInlineSnapshot("-100000n");
    expect(parseEther("-0.00001", "gwei")).toMatchInlineSnapshot("-10000n");
    expect(parseEther("-0.000001", "gwei")).toMatchInlineSnapshot("-1000n");
    expect(parseEther("-0.0000001", "gwei")).toMatchInlineSnapshot("-100n");
    expect(parseEther("-0.00000001", "gwei")).toMatchInlineSnapshot("-10n");
    expect(parseEther("-0.000000001", "gwei")).toMatchInlineSnapshot("-1n");
  });

  it("converts to rounded gwei", () => {
    expect(parseEther("0.0000000001", "gwei")).toMatchInlineSnapshot("0n");
    expect(parseEther("0.00000000059", "gwei")).toMatchInlineSnapshot("1n");
    expect(parseEther("1.00000000059", "gwei")).toMatchInlineSnapshot(
      "1000000001n",
    );
    expect(parseEther("69.59000000059", "gwei")).toMatchInlineSnapshot(
      "69590000001n",
    );
    expect(parseEther("1.2345678912345222", "gwei")).toMatchInlineSnapshot(
      "1234567891n",
    );
    expect(parseEther("-0.0000000001", "gwei")).toMatchInlineSnapshot("0n");
    expect(parseEther("-0.00000000059", "gwei")).toMatchInlineSnapshot("-1n");
    expect(parseEther("-1.00000000059", "gwei")).toMatchInlineSnapshot(
      "-1000000001n",
    );
    expect(parseEther("-69.59000000059", "gwei")).toMatchInlineSnapshot(
      "-69590000001n",
    );
    expect(parseEther("-1.2345678912345222", "gwei")).toMatchInlineSnapshot(
      "-1234567891n",
    );
  });

  it("converts to rounded wei", () => {
    expect(parseEther("0.0000000000000000001")).toMatchInlineSnapshot("0n");
    expect(parseEther("0.00000000000000000059")).toMatchInlineSnapshot("1n");
    expect(parseEther("1.00000000000000000059")).toMatchInlineSnapshot(
      "1000000000000000001n",
    );
    expect(parseEther("69.59000000000000000059")).toMatchInlineSnapshot(
      "69590000000000000001n",
    );
    expect(parseEther("1.2345678000000000912345222")).toMatchInlineSnapshot(
      "1234567800000000091n",
    );
    expect(parseEther("-0.0000000000000000001")).toMatchInlineSnapshot("0n");
    expect(parseEther("-0.00000000000000000059")).toMatchInlineSnapshot("-1n");
    expect(parseEther("-1.00000000000000000059")).toMatchInlineSnapshot(
      "-1000000000000000001n",
    );
    expect(parseEther("-69.59000000000000000059")).toMatchInlineSnapshot(
      "-69590000000000000001n",
    );
    expect(parseEther("-1.2345678000000000912345222")).toMatchInlineSnapshot(
      "-1234567800000000091n",
    );
  });
});
describe("parseGwei", () => {
  it("converts gwei to wei", () => {
    expect(parseGwei("69420.1234567")).toMatchInlineSnapshot("69420123456700n");
    expect(parseGwei("69420")).toMatchInlineSnapshot("69420000000000n");
    expect(parseGwei("1")).toMatchInlineSnapshot("1000000000n");
    expect(parseGwei("0.5")).toMatchInlineSnapshot("500000000n");
    expect(parseGwei("0.1")).toMatchInlineSnapshot("100000000n");
    expect(parseGwei("0.01")).toMatchInlineSnapshot("10000000n");
    expect(parseGwei("0.001")).toMatchInlineSnapshot("1000000n");
    expect(parseGwei("0.0001")).toMatchInlineSnapshot("100000n");
    expect(parseGwei("0.00001")).toMatchInlineSnapshot("10000n");
    expect(parseGwei("0.000001")).toMatchInlineSnapshot("1000n");
    expect(parseGwei("0.0000001")).toMatchInlineSnapshot("100n");
    expect(parseGwei("0.00000001")).toMatchInlineSnapshot("10n");
    expect(parseGwei("0.000000001")).toMatchInlineSnapshot("1n");

    expect(parseGwei("-6942060.123456")).toMatchInlineSnapshot(
      "-6942060123456000n",
    );
    expect(parseGwei("-6942069420")).toMatchInlineSnapshot(
      "-6942069420000000000n",
    );
    expect(parseGwei("-1")).toMatchInlineSnapshot("-1000000000n");
    expect(parseGwei("-0.5")).toMatchInlineSnapshot("-500000000n");
    expect(parseGwei("-0.1")).toMatchInlineSnapshot("-100000000n");
    expect(parseGwei("-0.01")).toMatchInlineSnapshot("-10000000n");
    expect(parseGwei("-0.001")).toMatchInlineSnapshot("-1000000n");
    expect(parseGwei("-0.0001")).toMatchInlineSnapshot("-100000n");
    expect(parseGwei("-0.00001")).toMatchInlineSnapshot("-10000n");
    expect(parseGwei("-0.000001")).toMatchInlineSnapshot("-1000n");
    expect(parseGwei("-0.0000001")).toMatchInlineSnapshot("-100n");
    expect(parseGwei("-0.00000001")).toMatchInlineSnapshot("-10n");
    expect(parseGwei("-0.000000001")).toMatchInlineSnapshot("-1n");
  });

  it("converts to rounded wei", () => {
    expect(parseGwei("0.0000000001")).toMatchInlineSnapshot("0n");
    expect(parseGwei("0.00000000059")).toMatchInlineSnapshot("1n");
    expect(parseGwei("1.00000000059")).toMatchInlineSnapshot("1000000001n");
    expect(parseGwei("69.59000000059")).toMatchInlineSnapshot("69590000001n");
    expect(parseGwei("1.2345678912345222")).toMatchInlineSnapshot(
      "1234567891n",
    );
    expect(parseGwei("-0.0000000001")).toMatchInlineSnapshot("0n");
    expect(parseGwei("-0.00000000059")).toMatchInlineSnapshot("-1n");
    expect(parseGwei("-1.00000000059")).toMatchInlineSnapshot("-1000000001n");
    expect(parseGwei("-69.59000000059")).toMatchInlineSnapshot("-69590000001n");
    expect(parseGwei("-1.2345678912345222")).toMatchInlineSnapshot(
      "-1234567891n",
    );
  });
});
