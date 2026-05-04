import { AxiosError } from 'axios';

export function handleApiError(err: unknown): string {
  if (!err) return 'Unknown error';
  const e = err as AxiosError;
  if (e.response && e.response.data) {
    try {
      const data: any = e.response.data;
      if (typeof data === 'string') return data;
      if (data.error) return data.error;
      if (data.message) return data.message;
    } catch (ex) {
      // fallthrough
    }
  }
  if ((err as Error).message) return (err as Error).message;
  return String(err);
}
