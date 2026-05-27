import { useState, useEffect, useRef, useCallback } from 'react';

export function useDebouncedSearch(initialValue = '', delay = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timerRef = useRef(null);
  
  // FIX: Track mount status
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (searchTerm === debouncedTerm) {
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      // FIX: Only update state if component is still mounted
      if (isMounted.current) {
        setDebouncedTerm(searchTerm);
        setIsDebouncing(false);
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchTerm, delay]);

  const clear = useCallback(() => {
    setSearchTerm('');
    setDebouncedTerm('');
    setIsDebouncing(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return {
    searchTerm,
    debouncedTerm,
    setSearchTerm,
    isDebouncing,
    clear,
  };
}

export default useDebouncedSearch;