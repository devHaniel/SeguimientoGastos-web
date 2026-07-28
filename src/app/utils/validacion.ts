const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function validarEmail(email: string): string {
  if (!email) return 'El email es obligatorio';
  if (!emailRegex.test(email)) return 'El email no tiene un formato válido';
  return '';
}

export function validarRequerido(valor: string, campo: string): string {
  if (!valor || !valor.trim()) return `${campo} es obligatorio`;
  return '';
}

export function validarMinLength(valor: string, min: number, campo: string): string {
  if (valor.length < min) return `${campo} debe tener al menos ${min} caracteres`;
  return '';
}

export function validarMonto(valor: number): string {
  if (!valor || valor <= 0) return 'El monto debe ser mayor a 0';
  return '';
}
