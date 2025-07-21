import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface BookingModificationData {
  bookingId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  equipmentName: string;
  changes: Array<{
    field: string;
    oldValue: string;
    newValue: string;
  }>;
  modificationDate: string;
  reason?: string;
}

export class EmailService {
  static async sendBookingModificationAlert(data: BookingModificationData): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log("SendGrid API key not configured, skipping email notification");
      return false;
    }

    try {
      const changesHtml = data.changes.map(change => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">
            ${this.getFieldDisplayName(change.field)}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #dc2626;">
            ${change.oldValue}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #059669;">
            ${change.newValue}
          </td>
        </tr>
      `).join('');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Modification de réservation - Aywa</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FF6B35, #F7931E); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🔔 Modification de Réservation</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Plateforme Aywa - Notification automatique</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #FF6B35;">
              <h2 style="margin: 0 0 15px 0; color: #FF6B35;">📋 Informations de la réservation</h2>
              <p><strong>Réservation #:</strong> ${data.bookingId}</p>
              <p><strong>Client:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              <p><strong>Téléphone:</strong> ${data.customerPhone}</p>
              <p><strong>Équipement:</strong> ${data.equipmentName}</p>
              <p><strong>Date de modification:</strong> ${new Date(data.modificationDate).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              ${data.reason ? `<p><strong>Raison:</strong> ${data.reason}</p>` : ''}
            </div>

            <div style="background: white; padding: 20px;">
              <h3 style="color: #FF6B35; margin: 0 0 15px 0;">📝 Détails des modifications</h3>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Champ modifié</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Ancienne valeur</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Nouvelle valeur</th>
                  </tr>
                </thead>
                <tbody>
                  ${changesHtml}
                </tbody>
              </table>
            </div>

            <div style="background: #fef3cd; padding: 15px; border-left: 4px solid #fbbf24; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #92400e;">⚠️ Action recommandée</h4>
              <p style="margin: 0;">
                Veuillez vérifier cette modification et contacter le client si nécessaire pour confirmer les détails.
                Vous pouvez accéder au tableau de bord administrateur pour plus d'informations.
              </p>
            </div>

            <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                Cette notification a été générée automatiquement par la plateforme Aywa.<br>
                Email envoyé à reservations@aywalogistic.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textContent = `
MODIFICATION DE RÉSERVATION - AYWA

Réservation #: ${data.bookingId}
Client: ${data.customerName}
Email: ${data.customerEmail}  
Téléphone: ${data.customerPhone}
Équipement: ${data.equipmentName}
Date de modification: ${new Date(data.modificationDate).toLocaleDateString('fr-FR')}
${data.reason ? `Raison: ${data.reason}` : ''}

MODIFICATIONS APPORTÉES:
${data.changes.map(change => 
  `• ${this.getFieldDisplayName(change.field)}: "${change.oldValue}" → "${change.newValue}"`
).join('\n')}

---
Cette notification a été générée automatiquement par la plateforme Aywa.
      `;

      const msg = {
        to: 'reservations@aywalogistic.com',
        from: 'noreply@aywalogistic.com',
        subject: `🔔 Réservation #${data.bookingId} modifiée - ${data.customerName}`,
        text: textContent,
        html: htmlContent,
      };

      await sgMail.send(msg);
      console.log(`Email notification sent for booking #${data.bookingId} modification`);
      return true;
    } catch (error) {
      console.error('Error sending booking modification email:', error);
      return false;
    }
  }

  static async sendNewBookingAlert(bookingData: any): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log("SendGrid API key not configured, skipping email notification");
      return false;
    }

    try {
      const msg = {
        to: 'reservations@aywalogistic.com',
        from: 'noreply@aywalogistic.com',
        subject: `🆕 Nouvelle réservation #${bookingData.id} - ${bookingData.customerName}`,
        html: `
          <h2>Nouvelle réservation sur Aywa</h2>
          <p><strong>Réservation #:</strong> ${bookingData.id}</p>
          <p><strong>Client:</strong> ${bookingData.customerName}</p>
          <p><strong>Email:</strong> ${bookingData.customerEmail}</p>
          <p><strong>Téléphone:</strong> ${bookingData.customerPhone}</p>
          <p><strong>Équipement:</strong> ${bookingData.equipmentName}</p>
          <p><strong>Période:</strong> Du ${bookingData.startDate} au ${bookingData.endDate}</p>
          <p><strong>Prix total:</strong> ${bookingData.totalPrice.toLocaleString()} FCFA</p>
        `
      };

      await sgMail.send(msg);
      console.log(`New booking email sent for booking #${bookingData.id}`);
      return true;
    } catch (error) {
      console.error('Error sending new booking email:', error);
      return false;
    }
  }

  private static getFieldDisplayName(field: string): string {
    const fieldNames: Record<string, string> = {
      'startDate': 'Date de début',
      'endDate': 'Date de fin',
      'totalPrice': 'Prix total',
      'status': 'Statut de réservation',
      'customerName': 'Nom du client',
      'customerEmail': 'Email du client',
      'customerPhone': 'Téléphone du client',
      'notes': 'Notes',
      'paymentMethod': 'Méthode de paiement',
      'paymentStatus': 'Statut du paiement'
    };
    return fieldNames[field] || field;
  }
}