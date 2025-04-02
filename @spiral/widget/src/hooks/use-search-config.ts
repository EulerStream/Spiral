export type SearchConfig = {
  sessionId: string | null;
}

export function useSearchConfig(): SearchConfig {
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('sessionId');

  return {
    sessionId
  };

}