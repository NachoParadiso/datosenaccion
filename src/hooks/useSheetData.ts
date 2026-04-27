import { useState, useEffect, useCallback, useRef } from 'react';
import { Registro, DataStatus } from '../types';
import { parseCSV } from '../utils/csvParser';
import { MOCK_DATA } from '../data/mockData';

const REFRESH_MS = Number(import.meta.env.VITE_REFRESH_INTERVAL ?? 10_000);
const CSV_URL = import.meta.env.VITE_GOOGLE_SHEETS_CSV_URL as string | undefined;

export function useSheetData() {
  const [data, setData] = useState<Registro[]>([]);
  const [status, setStatus] = useState<DataStatus>('idle');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string>(() =>
    localStorage.getItem('uba_csv_url') ?? CSV_URL ?? ''
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const usingMock = !customUrl || customUrl === 'PEGAR_ACA_LA_URL_PUBLICA_CSV';

  const fetchData = useCallback(async () => {
    if (usingMock) {
      setData(MOCK_DATA);
      setStatus('mock');
      setLastUpdate(new Date());
      return;
    }

    setStatus('loading');
    try {
      // Add cache-busting query param so Google Sheets doesn't cache
      const url = `${customUrl}${customUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseCSV(text);
      setData(parsed);
      setStatus('ok');
      setLastUpdate(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
      setStatus('error');
      // Fallback to mock on error
      setData(MOCK_DATA);
    }
  }, [customUrl, usingMock]);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, REFRESH_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchData]);

  const saveCustomUrl = (url: string) => {
    localStorage.setItem('uba_csv_url', url);
    setCustomUrl(url);
  };

  return { data, status, lastUpdate, error, usingMock, customUrl, saveCustomUrl, refresh: fetchData };
}
