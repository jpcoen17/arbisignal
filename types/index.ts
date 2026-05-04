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
  | "BTC/USDT"
  | "ETH/USDT"
  | "BNB/USDT"
  | "SOL/USDT"
  | "XRP/USDT"
  | "DOGE/USDT"
  | "ADA/USDT"
  | "AVAX/USDT"
  | "SHIB/USDT"
  | "TRX/USDT"
  | "DOT/USDT"
  | "LINK/USDT"
  | "TON/USDT"
  | "MATIC/USDT"
  | "LTC/USDT"
  | "BCH/USDT"
  | "NEAR/USDT"
  | "UNI/USDT"
  | "ICP/USDT"
  | "APT/USDT"
  | "SUI/USDT"
  | "FIL/USDT"
  | "ATOM/USDT"
  | "XLM/USDT"
  | "OP/USDT"
  | "INJ/USDT"
  | "ARB/USDT"
  | "HBAR/USDT"
  | "VET/USDT"
  | "MKR/USDT"
  | "AAVE/USDT"
  | "GRT/USDT"
  | "STX/USDT"
  | "ALGO/USDT"
  | "EGLD/USDT"
  | "XTZ/USDT"
  | "MANA/USDT"
  | "SAND/USDT"
  | "AXS/USDT"
  | "FTM/USDT"
  | "EOS/USDT"
  | "THETA/USDT"
  | "FLOW/USDT"
  | "CHZ/USDT"
  | "RUNE/USDT"
  | "KAS/USDT"
  | "SEI/USDT"
  | "TIA/USDT"
  | "WIF/USDT"
  | "BONK/USDT"
  | "PEPE/USDT"
  | "JUP/USDT"
  | "STRK/USDT"
  | "PYTH/USDT";
export type Exchange = "Binance" | "Bybit";