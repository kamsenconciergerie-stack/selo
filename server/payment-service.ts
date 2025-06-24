import { Payment, InsertPayment } from "../shared/schema.js";

export interface PaymentProvider {
  initiatePayment(amount: number, phoneNumber: string, reference: string): Promise<PaymentResponse>;
  checkPaymentStatus(transactionId: string): Promise<PaymentStatusResponse>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  paymentUrl?: string;
}

export interface PaymentStatusResponse {
  status: "pending" | "completed" | "failed" | "cancelled";
  transactionId: string;
  message?: string;
}

// Orange Money API Integration
export class OrangeMoneyProvider implements PaymentProvider {
  private apiUrl = "https://api.orange.com/orange-money-webpay/dev/v1";
  private merchantKey: string;
  private merchantId: string;

  constructor(merchantKey: string, merchantId: string) {
    this.merchantKey = merchantKey;
    this.merchantId = merchantId;
  }

  async initiatePayment(amount: number, phoneNumber: string, reference: string): Promise<PaymentResponse> {
    try {
      // Format phone number for Orange Money (remove country code if present)
      const formattedPhone = phoneNumber.replace(/^\+221/, "").replace(/^221/, "");
      
      const payload = {
        merchant_key: this.merchantKey,
        currency: "XOF",
        order_id: reference,
        amount: amount,
        return_url: `${process.env.REPLIT_DOMAINS}/payment/callback`,
        cancel_url: `${process.env.REPLIT_DOMAINS}/payment/cancel`,
        notif_url: `${process.env.REPLIT_DOMAINS}/api/payment/webhook/orange`,
        lang: "fr",
        reference: `AYWA-${reference}`,
        customer_msisdn: formattedPhone,
      };

      const response = await fetch(`${this.apiUrl}/webpayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.merchantKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.pay_token) {
        return {
          success: true,
          transactionId: data.pay_token,
          message: "Paiement initié avec succès",
          paymentUrl: `${this.apiUrl}/webpayment/${data.pay_token}`,
        };
      } else {
        return {
          success: false,
          message: data.message || "Erreur lors de l'initialisation du paiement Orange Money",
        };
      }
    } catch (error) {
      console.error("Orange Money payment error:", error);
      return {
        success: false,
        message: "Erreur de connexion au service Orange Money",
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/webpayment/${transactionId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.merchantKey}`,
        },
      });

      const data = await response.json();

      let status: PaymentStatusResponse["status"] = "pending";
      if (data.status === "SUCCESS") status = "completed";
      else if (data.status === "FAILED") status = "failed";
      else if (data.status === "CANCELLED") status = "cancelled";

      return {
        status,
        transactionId,
        message: data.message,
      };
    } catch (error) {
      console.error("Orange Money status check error:", error);
      return {
        status: "failed",
        transactionId,
        message: "Erreur lors de la vérification du statut",
      };
    }
  }
}

// Wave API Integration
export class WaveProvider implements PaymentProvider {
  private apiUrl = "https://api.wave.com/v1";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initiatePayment(amount: number, phoneNumber: string, reference: string): Promise<PaymentResponse> {
    try {
      // Format phone number for Wave (ensure +221 prefix)
      const formattedPhone = phoneNumber.startsWith("+221") ? phoneNumber : `+221${phoneNumber.replace(/^221/, "")}`;
      
      const payload = {
        amount: amount,
        currency: "XOF",
        error_url: `${process.env.REPLIT_DOMAINS}/payment/error`,
        success_url: `${process.env.REPLIT_DOMAINS}/payment/success`,
        customer_phone: formattedPhone,
        merchant_reference: `AYWA-${reference}`,
        description: `Location équipement Aywa - ${reference}`,
      };

      const response = await fetch(`${this.apiUrl}/checkout/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        return {
          success: true,
          transactionId: data.id,
          message: "Paiement initié avec succès",
          paymentUrl: data.wave_launch_url,
        };
      } else {
        return {
          success: false,
          message: data.message || "Erreur lors de l'initialisation du paiement Wave",
        };
      }
    } catch (error) {
      console.error("Wave payment error:", error);
      return {
        success: false,
        message: "Erreur de connexion au service Wave",
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/checkout/sessions/${transactionId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
      });

      const data = await response.json();

      let status: PaymentStatusResponse["status"] = "pending";
      if (data.payment_status === "completed") status = "completed";
      else if (data.payment_status === "failed") status = "failed";
      else if (data.payment_status === "cancelled") status = "cancelled";

      return {
        status,
        transactionId,
        message: data.message,
      };
    } catch (error) {
      console.error("Wave status check error:", error);
      return {
        status: "failed",
        transactionId,
        message: "Erreur lors de la vérification du statut",
      };
    }
  }
}

// Payment Service
export class PaymentService {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    // Initialize providers with environment variables
    if (process.env.ORANGE_MONEY_MERCHANT_KEY && process.env.ORANGE_MONEY_MERCHANT_ID) {
      this.providers.set("orange_money", new OrangeMoneyProvider(
        process.env.ORANGE_MONEY_MERCHANT_KEY,
        process.env.ORANGE_MONEY_MERCHANT_ID
      ));
    }

    if (process.env.WAVE_API_KEY) {
      this.providers.set("wave", new WaveProvider(process.env.WAVE_API_KEY));
    }
  }

  async initiatePayment(
    method: string,
    amount: number,
    phoneNumber: string,
    reference: string
  ): Promise<PaymentResponse> {
    const provider = this.providers.get(method);
    if (!provider) {
      return {
        success: false,
        message: `Méthode de paiement ${method} non supportée`,
      };
    }

    return provider.initiatePayment(amount, phoneNumber, reference);
  }

  async checkPaymentStatus(method: string, transactionId: string): Promise<PaymentStatusResponse> {
    const provider = this.providers.get(method);
    if (!provider) {
      return {
        status: "failed",
        transactionId,
        message: `Méthode de paiement ${method} non supportée`,
      };
    }

    return provider.checkPaymentStatus(transactionId);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const paymentService = new PaymentService();