import { createContext, useState, useContext, useCallback } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const startLoading = useCallback((key) => {
    setLoading(key, true);
  }, [setLoading]);

  const stopLoading = useCallback((key) => {
    setLoading(key, false);
  }, [setLoading]);

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const setGlobalLoadingState = useCallback((isLoading) => {
    setGlobalLoading(isLoading);
  }, []);

  const withLoading = useCallback(async (key, asyncFunction) => {
    startLoading(key);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={{
      loadingStates,
      globalLoading,
      setLoading,
      startLoading,
      stopLoading,
      isLoading,
      setGlobalLoadingState,
      withLoading
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}; 