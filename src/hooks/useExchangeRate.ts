import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState<number>(1600); // Default to 1600 as a fallback
  const [loadingRate, setLoadingRate] = useState<boolean>(true);

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('value')
        .eq('key', 'exchange_rate')
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') { // not found is okay, fallback is used
          console.error("Error fetching exchange rate:", error);
        }
        return;
      }
      
      if (data && (data as any).value && typeof (data as any).value === 'object' && 'usd_to_ngn' in (data as any).value) {
        setExchangeRate(Number((data as any).value.usd_to_ngn));
      }
    } catch (err) {
      console.error("Error in fetchExchangeRate:", err);
    } finally {
      setLoadingRate(false);
    }
  };

  const updateExchangeRate = async (newRate: number) => {
    try {
      const { error } = await supabase
        .from('site_settings' as any)
        .upsert({
          key: 'exchange_rate',
          value: { usd_to_ngn: newRate },
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setExchangeRate(newRate);
      return { success: true };
    } catch (error: any) {
      console.error("Error updating exchange rate:", error);
      return { success: false, error };
    }
  };

  return { exchangeRate, loadingRate, updateExchangeRate, fetchExchangeRate };
};
