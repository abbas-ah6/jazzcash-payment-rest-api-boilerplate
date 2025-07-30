/**
 * Generate transaction expiry date for JazzCash API
 * According to documentation: "default and maximum value of this expiry is 3 months"
 * But for better UX, setting to 1 hour as minimum viable expiry
 * @param start timestamp in yyyyMMddHHmmss format
 * @returns expiry timestamp in yyyyMMddHHmmss format
 */
export function generateExpiryDate(start: string): string {
  const year = +start.slice(0, 4);
  const month = +start.slice(4, 6) - 1;
  const day = +start.slice(6, 8);
  const hour = +start.slice(8, 10);
  const minute = +start.slice(10, 12);
  const second = +start.slice(12, 14);

  const date = new Date(year, month, day, hour, minute, second);
  
  date.setHours(date.getHours() + 1);

  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');

  return `${yyyy}${mm}${dd}${hh}${min}${ss}`;
}