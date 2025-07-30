import axios from "axios";
import { generateSecureHash } from "./utils/hash";
import { mapCustomParams } from "./utils/mapCustomParams";
import { generateExpiryDate } from "./utils/generateExpiryDate";

export interface JazzCashConfig {
  merchantId: string;
  password: string;
  integritySalt: string;
  environment?: "sandbox" | "production";
}

export interface PaymentPayload {
  txnType: "MWALLET";
  amount: string;
  billReference: string;
  description: string;
  mobileNumber: string;
  cnic: string;
  customParams?: Record<string, string>;
}

export class JazzCashClient {
  private readonly merchantId: string;
  private readonly password: string;
  private readonly integritySalt: string;
  private readonly baseUrl: string;

  constructor(private config: JazzCashConfig) {
    this.merchantId = config.merchantId;
    this.password = config.password;
    this.integritySalt = config.integritySalt;
    this.baseUrl =
      config.environment === "production"
        ? "https://payments.jazzcash.com.pk/ApplicationAPI/API/Purchase/DoMWalletTransaction"
        : "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction";
  }

  async initiatePayment(data: PaymentPayload) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 14);

    const params: Record<string, string> = {
      pp_Version: "1.1",
      pp_TxnType: data.txnType,
      pp_Language: "EN",
      pp_MerchantID: this.merchantId,
      pp_SubMerchantID: "", 
      pp_Password: this.password,
      pp_TxnRefNo: `T${Date.now()}`,
      pp_Amount: data.amount,
      pp_TxnCurrency: "PKR",
      pp_MobileNumber: data.mobileNumber,
      pp_CNIC: data.cnic,
      pp_DiscountedAmount: "", 
      pp_TxnDateTime: timestamp,
      pp_BillReference: data.billReference,
      pp_Description: data.description,
      pp_TxnExpiryDateTime: generateExpiryDate(timestamp),
      ...mapCustomParams(data.customParams),
    };

    params["pp_SecureHash"] = generateSecureHash(params, this.integritySalt);

    try {
      const response = await axios.post(this.baseUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transformRequest: [(data) => {
          return Object.keys(data)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
            .join('&');
        }]
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`JazzCash Transaction failed: ${error.response?.data?.responseMessage || error.message}`);
    }
  }
}