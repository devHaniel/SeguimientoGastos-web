function monedaALaIzquierda(): boolean {
  try {
    const parts = new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: 'EUR',
    }).formatToParts(100);
    const symbolIdx = parts.findIndex((p) => p.type === 'currency');
    const intIdx = parts.findIndex((p) => p.type === 'integer');
    return intIdx === -1 || symbolIdx < intIdx;
  } catch {
    return true;
  }
}

function simbolo(): string {
  return localStorage.getItem('moneda') || '$';
}

function formatearNumero(n: number, decimales: number): string {
  return n.toLocaleString('es-CO', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

export function formatoMoneda(n: number): string {
  const s = simbolo();
  const num = formatearNumero(n, 0);
  return monedaALaIzquierda() ? `${s} ${num}` : `${num} ${s}`;
}

export function formatoMonedaDecimal(n: number): string {
  const s = simbolo();
  const num = formatearNumero(n, 2);
  return monedaALaIzquierda() ? `${s} ${num}` : `${num} ${s}`;
}
