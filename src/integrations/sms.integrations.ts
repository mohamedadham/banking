import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private readonly client: twilio.Twilio;
  private readonly twilioPhoneNumber: string = process.env.TWILIO_PHONE_NUMBER;

  constructor() {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

    this.client = twilio(twilioAccountSid, twilioAuthToken);
  }

  async sendSMS(to: string, body: string): Promise<void> {
    try {
      await this.client.messages.create({
        body,
        from: this.twilioPhoneNumber,
        to,
      });
    } catch (error) {
      console.error('Error sending SMS:', error.message);
      throw new Error('Failed to send SMS');
    }
  }
}
