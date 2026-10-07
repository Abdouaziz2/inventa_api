import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

export interface BarcodeRendererProps {
  value: string;
  format?: 'CODE128' | 'EAN13' | 'CODE39';
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  className?: string;
}

export const BarcodeRenderer: React.FC<BarcodeRendererProps> = ({
  value,
  format = 'CODE128',
  width = 1.4,
  height = 36,
  displayValue = true,
  fontSize = 11,
  className,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;

    try {
      JsBarcode(svgRef.current, value, {
        format,
        width,
        height,
        displayValue,
        fontSize,
        textMargin: 2,
        margin: 4,
        background: '#ffffff',
        lineColor: '#000000',
      });
    } catch (err) {
      console.warn('Erreur génération code-barres pour la valeur:', value, err);
    }
  }, [value, format, width, height, displayValue, fontSize]);

  return <svg ref={svgRef} role="img" aria-label={`Code-barres ${value}`} className={className} />;
};
