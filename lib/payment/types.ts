export interface PaymentMethodsConfig {
  cardEnabled: boolean;
  mobileMoneyEnabled: boolean;
  evcEnabled: boolean;
  zaadEnabled: boolean;
  sahalEnabled: boolean;
  edahabEnabled: boolean;
  premierEnabled: boolean;
}

export const DEFAULT_PAYMENT_CONFIG: PaymentMethodsConfig = {
  cardEnabled: true,
  mobileMoneyEnabled: true,
  evcEnabled: true,
  zaadEnabled: true,
  sahalEnabled: true,
  edahabEnabled: true,
  premierEnabled: true,
};
