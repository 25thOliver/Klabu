import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingContextType {
  loadingStates: LoadingState;
  isLoading: (key?: string) => boolean;
  setLoading: (key: string, loading: boolean) => void;
  withLoading: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T>;
  clearLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const isLoading = (key?: string) => {
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.values(loadingStates).some(loading => loading);
  };

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));
  };

  const withLoading = async <T,>(key: string, asyncFn: () => Promise<T>): Promise<T> => {
    setLoading(key, true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(key, false);
    }
  };

  const clearLoading = () => {
    setLoadingStates({});
  };

  const value: LoadingContextType = {
    loadingStates,
    isLoading,
    setLoading,
    withLoading,
    clearLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};