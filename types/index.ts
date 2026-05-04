export type UserRole = "free" | "premium";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  telegram_chat_id: string | null;
  created_at: string;
}

export interface ExchangePrice {
  exchange: string;
  pair: string;
  price: number;
  timestamp: number;
}

export interface ArbitrageOpportunity {
  token: string;
  buy_exchange: string;
  sell_exchange: string;
  buy_price: number;
  sell_price: number;
  profit_percent: number;
  timestamp: number;
}

export interface AlertLog {
  id: string;
  user_id: string;
  token: string;
  buy_exchange: string;
  sell_exchange: string;
  profit_percent: number;
  timestamp: string;
}

export interface PricesResponse {
  prices: ExchangePrice[];
  timestamp: number;
}

export interface ArbitrageResponse {
  opportunities: ArbitrageOpportunity[];
  user_role: UserRole;
  threshold: number;
  timestamp: number;
}

export type TradingPair =
  | "BTC/USDT" | "ETH/USDT" | "BNB/USDT" | "SOL/USDT" | "XRP/USDT"
  | "DOGE/USDT" | "ADA/USDT" | "AVAX/USDT" | "SHIB/USDT" | "DOT/USDT"
  | "LINK/USDT" | "TRX/USDT" | "MATIC/USDT" | "LTC/USDT" | "BCH/USDT"
  | "ATOM/USDT" | "XLM/USDT" | "ETC/USDT" | "FIL/USDT" | "APT/USDT"
  | "ARB/USDT" | "OP/USDT" | "NEAR/USDT" | "INJ/USDT" | "SUI/USDT"
  | "HBAR/USDT" | "VET/USDT" | "ALGO/USDT" | "GRT/USDT" | "SAND/USDT"
  | "MANA/USDT" | "AXS/USDT" | "THETA/USDT" | "EGLD/USDT" | "XTZ/USDT"
  | "AAVE/USDT" | "MKR/USDT" | "SNX/USDT" | "UNI/USDT" | "CRV/USDT"
  | "LDO/USDT" | "FTM/USDT" | "RUNE/USDT" | "KAVA/USDT" | "ZIL/USDT"
  | "FLOW/USDT" | "CHZ/USDT" | "ENJ/USDT" | "1INCH/USDT" | "COMP/USDT";

export type Exchange = "Binance" | "Bybit";
