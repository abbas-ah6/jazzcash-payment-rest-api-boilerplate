import { createHmac } from "crypto";

/**
 * Generate a secure hash using HMAC-SHA256 for JAZZCASH API
 * Based on official JazzCash documentation parameter order
 * @param params object containing parameters to be hashed
 * @param integritySalt JazzCash provided integrity salt
 * @returns Hashed string
 */
export function generateSecureHash(
  params: Record<string, string>,
  integritySalt: string
): string {
  // Fixed parameter order based on JazzCash documentation for Mobile Account API v1.1
  const orderedKeys = [
    "pp_Amount",
    "pp_BillReference",
    "pp_CNIC",
    "pp_Description",
    "pp_DiscountedAmount",
    "pp_Language",
    "pp_MerchantID",
    "pp_MobileNumber",
    "pp_Password",
    "pp_SubMerchantID",
    "pp_TxnCurrency",
    "pp_TxnDateTime",
    "pp_TxnExpiryDateTime",
    "pp_TxnRefNo",
    "pp_TxnType",
    "pp_Version",
    "ppmpf_1",
    "ppmpf_2",
    "ppmpf_3",
    "ppmpf_4",
    "ppmpf_5",
  ];

  const concatString = orderedKeys
    .map((key) => params[key])
    .filter((val) => val !== "")
    .join("&");

  const hashString = `${integritySalt}&${concatString}`;

  return createHmac("sha256", integritySalt).update(hashString).digest("hex");
}
