// SMS Service for Senegal using popular providers
import nodemailer from 'nodemailer';

interface SMSProvider {
  name: string;
  sendSMS: (phone: string, message: string) => Promise<boolean>;
}

// Orange SMS API (simulation for demo)
class OrangeSMSProvider implements SMSProvider {
  name = 'Orange SMS';

  async sendSMS(phone: string, message: string): Promise<boolean> {
    try {
      // In production, integrate with Orange SMS API
      console.log(`[Orange SMS] Sending to ${phone}: ${message}`);
      
      // Simulate SMS sending with email as fallback for demo
      if (process.env.SMTP_HOST) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: 'notifications@kamsen.sn',
          to: 'admin@kamsen.com',
          subject: `SMS to ${phone}`,
          text: message,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Orange SMS error:', error);
      return false;
    }
  }
}

// Tigo SMS API (simulation for demo)
class TigoSMSProvider implements SMSProvider {
  name = 'Tigo SMS';

  async sendSMS(phone: string, message: string): Promise<boolean> {
    try {
      console.log(`[Tigo SMS] Sending to ${phone}: ${message}`);
      return true;
    } catch (error) {
      console.error('Tigo SMS error:', error);
      return false;
    }
  }
}

export class SMSService {
  private providers: SMSProvider[] = [
    new OrangeSMSProvider(),
    new TigoSMSProvider(),
  ];

  async sendSMS(phone: string, message: string): Promise<boolean> {
    // Clean phone number (ensure Senegal format)
    const cleanPhone = this.cleanPhoneNumber(phone);
    
    for (const provider of this.providers) {
      try {
        const success = await provider.sendSMS(cleanPhone, message);
        if (success) {
          console.log(`SMS sent successfully via ${provider.name}`);
          return true;
        }
      } catch (error) {
        console.error(`Failed to send SMS via ${provider.name}:`, error);
        continue;
      }
    }
    
    console.error('All SMS providers failed');
    return false;
  }

  private cleanPhoneNumber(phone: string): string {
    // Clean and format Senegalese phone numbers
    const cleaned = phone.replace(/\D/g, '');
    
    // Add country code if missing
    if (cleaned.startsWith('7') && cleaned.length === 9) {
      return '+221' + cleaned;
    } else if (cleaned.startsWith('221') && cleaned.length === 12) {
      return '+' + cleaned;
    }
    
    return phone; // Return as-is if can't format
  }

  async sendBookingConfirmation(phone: string, bookingId: number, equipmentName: string): Promise<boolean> {
    const message = `Kamsen: Votre réservation #${bookingId} pour ${equipmentName} a été confirmée. Merci de votre confiance!`;
    return this.sendSMS(phone, message);
  }

  async sendPaymentReminder(phone: string, bookingId: number, amount: number): Promise<boolean> {
    const message = `Kamsen: Rappel paiement pour réservation #${bookingId}. Montant: ${amount} XOF. Payez via Orange Money/Wave.`;
    return this.sendSMS(phone, message);
  }

  async sendMaintenanceAlert(phone: string, equipmentName: string, maintenanceDate: string): Promise<boolean> {
    const message = `Kamsen: Maintenance programmée pour ${equipmentName} le ${maintenanceDate}. Contact: +221 71 018 89 89`;
    return this.sendSMS(phone, message);
  }
}

export const smsService = new SMSService();