/// <reference types="vite/client" />

declare module '@chakra-ui/react' {
  export interface ChakraProviderProps {
    children: React.ReactNode;
    theme?: any;
    resetCSS?: boolean;
    portalZIndex?: number;
  }
}
