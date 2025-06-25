import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async processPayment(data: {
    amount: number;
    currency: string;
    paymentMethodId?: string;
    reservationId: string;
    userId: string;
  }): Promise<{
    paymentIntentId: string;
    chargeId?: string;
    status: string;
  }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        payment_method: data.paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        metadata: {
          reservationId: data.reservationId,
          userId: data.userId,
        },
      });
      return {
        paymentIntentId: paymentIntent.id,
        chargeId: null, // Will be updated when payment completes via webhook
        status: paymentIntent.status,
      };
    } catch (error) {
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  }

  async processRefund(data: {
    chargeId: string;
    amount?: number;
    reason?: string;
  }): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        charge: data.chargeId,
        amount: data.amount,
        reason: data.reason as Stripe.RefundCreateParams.Reason,
      });

      return refund;
    } catch (error) {
      throw new Error(`Stripe refund failed: ${error.message}`);
    }
  }

  async createPaymentMethod(data: {
    type: 'card';
    card: {
      number: string;
      exp_month: number;
      exp_year: number;
      cvc: string;
    };
  }): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create(data);
      return paymentMethod;
    } catch (error) {
      throw new Error(`Failed to create payment method: ${error.message}`);
    }
  }

  async createCustomer(data: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create(data);
      return customer;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  async attachPaymentMethodToCustomer(
    paymentMethodId: string,
    customerId: string
  ): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(
        paymentMethodId,
        { customer: customerId }
      );
      return paymentMethod;
    } catch (error) {
      throw new Error(`Failed to attach payment method: ${error.message}`);
    }
  }

  async detachPaymentMethod(
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod =
        await this.stripe.paymentMethods.detach(paymentMethodId);
      return paymentMethod;
    } catch (error) {
      throw new Error(`Failed to detach payment method: ${error.message}`);
    }
  }

  async retrievePaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  }

  async handleWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    try {
      const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      return event;
    } catch (error) {
      throw new Error(
        `Webhook signature verification failed: ${error.message}`
      );
    }
  }
}
