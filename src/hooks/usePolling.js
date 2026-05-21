import { useState, useEffect, useCallback, useRef } from 'react';

export function usePolling(fetchFn, intervalMs = 30000, enabled = true) {
  const [lastSynced, setLastSynced] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  const sync = useCallback(async () => {
    await fetchRef.current();
    setLastSynced(new Date());
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    sync();
    const pollId = setInterval(sync, intervalMs);
    return () => clearInterval(pollId);
  }, [sync, intervalMs, enabled]);

  useEffect(() => {
    if (!lastSynced) return undefined;
    const tick = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastSynced.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastSynced]);

  return { lastSynced, secondsAgo, refresh: sync };
}
