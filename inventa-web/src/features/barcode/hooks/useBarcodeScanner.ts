import { useEffect, useRef } from 'react';

export interface UseBarcodeScannerOptions {
  onScan: (scannedBarcode: string) => void;
  minChars?: number;
  maxDelayMs?: number;
  enabled?: boolean;
}

/**
 * Hook d'écoute pour les douchettes / scanners de codes-barres USB ou Bluetooth.
 * Détecte les frappes rapides caractéristiques d'un lecteur optique.
 */
export function useBarcodeScanner({
  onScan,
  minChars = 3,
  maxDelayMs = 60,
  enabled = true,
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Évite d'intercepter la saisie si l'utilisateur tape normalement dans un input texte classique
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;

      // Si l'utilisateur tape dans un champ avec la classe 'barcode-ignore-scanner', on ignore
      if (isInput && !(activeElement as HTMLElement).classList.contains('allow-scanner-intercept')) {
        return;
      }

      const now = Date.now();
      const timeDiff = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      // Si la touche est 'Enter', on termine la lecture
      if (e.key === 'Enter') {
        if (bufferRef.current.length >= minChars) {
          e.preventDefault();
          const code = bufferRef.current.trim();
          bufferRef.current = '';
          onScan(code);
        } else {
          bufferRef.current = '';
        }
        return;
      }

      // Si le délai entre deux caractères est supérieur au maxDelay, on réinitialise (frappe humaine lente)
      if (timeDiff > maxDelayMs && bufferRef.current.length > 0) {
        bufferRef.current = '';
      }

      // Ajoute les caractères imprimables
      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onScan, minChars, maxDelayMs, enabled]);
}
