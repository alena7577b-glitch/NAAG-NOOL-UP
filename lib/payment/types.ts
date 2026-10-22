export interface PaymentMethodsConfig {
  cardEnabled: boolean;
  paypalEnabled: boolean;
  stripeEnabled?: boolean;
  mobileMoneyEnabled?: boolean;
  evcEnabled?: boolean;
  zaadEnabled?: boolean;
  sahalEnabled?: boolean;
  edahabEnabled?: boolean;
  premierEnabled?: boolean;
}

export const DEFAULT_PAYMENT_CONFIG: PaymentMethodsConfig = {
  cardEnabled: true,
  stripeEnabled: true,
  paypalEnabled: true,
  mobileMoneyEnabled: false,
  evcEnabled: false,
  zaadEnabled: false,
  sahalEnabled: false,
  edahabEnabled: false,
  premierEnabled: false,
};
