// Extensões de tipos para window
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: {
      (...args: any[]): void;
      callMethod?: (...args: any[]) => void;
      queue: any[];
      push: any;
      loaded: boolean;
      version: string;
    };
  }
}

export {};
