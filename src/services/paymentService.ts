// South African Payment Service - PayFast Integration
// PayFast is the leading payment gateway in South Africa
import CryptoJS from 'crypto-js';

interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passPhrase: string;
  testMode: boolean;
}

interface PaymentRequest {
  amount: number;
  itemName: string;
  itemDescription: string;
  customerEmail: string;
  customerName: string;
  orderId: string;
  vatAmount?: number;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  error?: string;
  transactionId?: string;
}

class PaymentService {
  private config: PayFastConfig;

  constructor() {
    this.config = {
      merchantId: process.env.REACT_APP_PAYFAST_MERCHANT_ID || '10000100',
      merchantKey: process.env.REACT_APP_PAYFAST_MERCHANT_KEY || '46f0cd694581a',
      passPhrase: process.env.REACT_APP_PAYFAST_PASSPHRASE || 'jt7NOE43FZPn',
      testMode: process.env.NODE_ENV !== 'production'
    };
  }

  /**
   * Generate PayFast payment URL for South African payments
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // PayFast requires amounts in cents
      const amountCents = Math.round(request.amount * 100);
      const vatCents = request.vatAmount ? Math.round(request.vatAmount * 100) : 0;

      // PayFast payment data
      const paymentData = {
        // Merchant details
        merchant_id: this.config.merchantId,
        merchant_key: this.config.merchantKey,
        
        // Transaction details
        amount: (amountCents / 100).toFixed(2), // PayFast expects decimal format
        item_name: request.itemName.substring(0, 100), // Max 100 chars
        item_description: request.itemDescription.substring(0, 255), // Max 255 chars
        
        // Custom fields
        custom_int1: request.orderId,
        custom_str1: 'GastroHub Order',
        
        // URLs
        return_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
        notify_url: `${window.location.origin}/api/payment/notify`,
        
        // Customer details
        name_first: request.customerName.split(' ')[0] || '',
        name_last: request.customerName.split(' ').slice(1).join(' ') || '',
        email_address: request.customerEmail,
        
        // South African specific
        payment_method: 'cc,dc,eft,mc,pc,aw,mt', // All available methods
        
        // VAT details for South African compliance
        ...(vatCents > 0 && {
          custom_str2: `VAT: R${(vatCents / 100).toFixed(2)}`,
          custom_str3: `Total incl VAT: R${((amountCents + vatCents) / 100).toFixed(2)}`
        })
      };

      // Generate signature for security
      const signature = this.generateSignature(paymentData);
      
      // PayFast URL
      const baseUrl = this.config.testMode 
        ? 'https://sandbox.payfast.co.za/eng/process'
        : 'https://www.payfast.co.za/eng/process';

      // Create form data string
      const formData = new URLSearchParams({
        ...paymentData,
        signature
      }).toString();

      const paymentUrl = `${baseUrl}?${formData}`;

      return {
        success: true,
        paymentUrl,
        transactionId: request.orderId
      };

    } catch (error) {
      console.error('PayFast payment creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed'
      };
    }
  }

  /**
   * Generate PayFast signature for security
   */
  private generateSignature(data: Record<string, any>): string {
    // Sort parameters and create query string
    const sortedKeys = Object.keys(data).sort();
    const queryString = sortedKeys
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');

    // Add passphrase if configured
    const stringToHash = this.config.passPhrase 
      ? `${queryString}&passphrase=${encodeURIComponent(this.config.passPhrase)}`
      : queryString;

    // Generate MD5 hash (PayFast requirement)
    return this.md5Hash(stringToHash);
  }

  /**
   * MD5 hash implementation for PayFast signature using crypto-js
   */
  private md5Hash(str: string): string {
    return CryptoJS.MD5(str).toString();
  }

  /**
   * Verify PayFast payment notification
   */
  async verifyPayment(notificationData: Record<string, any>): Promise<boolean> {
    try {
      // Verify signature
      const { signature, ...dataToVerify } = notificationData;
      const expectedSignature = this.generateSignature(dataToVerify);
      
      if (signature !== expectedSignature) {
        console.error('PayFast signature verification failed');
        return false;
      }

      // Additional verification with PayFast servers
      const verifyUrl = this.config.testMode
        ? 'https://sandbox.payfast.co.za/eng/query/validate'
        : 'https://www.payfast.co.za/eng/query/validate';

      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(notificationData).toString()
      });

      const result = await response.text();
      return result === 'VALID';

    } catch (error) {
      console.error('PayFast payment verification failed:', error);
      return false;
    }
  }

  /**
   * Get payment status
   */
  getPaymentStatus(paymentStatus: string): 'pending' | 'completed' | 'failed' | 'cancelled' {
    switch (paymentStatus?.toLowerCase()) {
      case 'complete':
        return 'completed';
      case 'failed':
        return 'failed';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }

  /**
   * Format South African currency
   */
  formatCurrency(amount: number, includeVAT: boolean = true): string {
    const formatter = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    });

    const formatted = formatter.format(amount);
    return includeVAT ? `${formatted} (incl. VAT)` : formatted;
  }

  /**
   * Calculate VAT (15% South African rate)
   */
  calculateVAT(amount: number): { vatAmount: number; totalWithVAT: number; totalExcludingVAT: number } {
    const VAT_RATE = 0.15;
    const vatAmount = amount * VAT_RATE;
    const totalWithVAT = amount + vatAmount;
    const totalExcludingVAT = amount;

    return {
      vatAmount: Math.round(vatAmount * 100) / 100,
      totalWithVAT: Math.round(totalWithVAT * 100) / 100,
      totalExcludingVAT: Math.round(totalExcludingVAT * 100) / 100
    };
  }
}

// Alternative payment methods for South Africa
export class OzowPaymentService {
  /**
   * Ozow is another popular South African payment gateway
   * Specializes in EFT payments
   */
  async createEFTPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Ozow implementation would go here
    console.log('Ozow EFT payment not yet implemented');
    return { success: false, error: 'Ozow integration pending' };
  }
}

export const paymentService = new PaymentService();
export const ozowService = new OzowPaymentService();

// Export types
export type { PaymentRequest, PaymentResponse }; 