import { describe, expect, it } from "vitest";
import { JazzCashClient } from "../src/client";

describe("JazzCashClient", () => {
  const jazzcash = new JazzCashClient({
    merchantId: "JAZZCASH_MERCHANT_ID",
    password: "JAZZCASH_PASSWORD",
    integritySalt: "JAZZCASH_INTEGRITY_SALT",
    environment: "sandbox",
  });

  it("should initiate a payment in sandbox mode", async () => {
    const response = await jazzcash.initiatePayment({
      txnType: "MWALLET",
      amount: "1000",
      billReference: "TestRef456",
      description: "Test Transaction",
      mobileNumber: "03123456789",
      cnic: "345678",
    });

    expect(response).toHaveProperty("pp_ResponseCode");
  });
});
