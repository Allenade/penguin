import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface CryptoPrices {
  btc_price: number;
  eth_price: number;
  sol_price: number;
  pengu_price: number;
  usdt_price: number;
}

export const useCryptoPrices = () => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>({
    btc_price: 45000,
    eth_price: 3000,
    sol_price: 100,
    pengu_price: 0.5,
    usdt_price: 1.0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch crypto prices from database
  const fetchCryptoPrices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from("crypto_prices")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching crypto prices:", error);
        return;
      }

      if (data) {
        setCryptoPrices({
          btc_price: data.btc_price || 45000,
          eth_price: data.eth_price || 3000,
          sol_price: data.sol_price || 100,
          pengu_price: data.pengu_price || 0.5,
          usdt_price: data.usdt_price || 1.0,
        });
      }
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get asset price by symbol
  const getAssetPrice = (symbol: string): number => {
    const priceMap: Record<string, number> = {
      BTC: cryptoPrices.btc_price,
      ETH: cryptoPrices.eth_price,
      SOL: cryptoPrices.sol_price,
      PENGU: cryptoPrices.pengu_price,
      USDT: cryptoPrices.usdt_price,
    };
    return priceMap[symbol] || 0;
  };

  // Calculate total value of assets
  const calculateTotalValue = (balances: Record<string, number>): number => {
    let total = 0;
    Object.entries(balances).forEach(([symbol, balance]) => {
      total += balance * getAssetPrice(symbol);
    });
    return total;
  };

  // Fetch prices on mount
  useEffect(() => {
    fetchCryptoPrices();
  }, []);

  // Real-time subscription to crypto_prices changes
  useEffect(() => {
    const subscription = (supabase as any)
      .channel("crypto_prices_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crypto_prices",
        },
        (payload: any) => {
          console.log("Crypto prices changed, refreshing:", payload);
          fetchCryptoPrices();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Periodic refresh as backup (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptoPrices();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    cryptoPrices,
    isLoading,
    getAssetPrice,
    calculateTotalValue,
    refreshPrices: fetchCryptoPrices,
  };
};

