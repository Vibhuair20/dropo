"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { IKContext } from "imagekitio-react";
import { ToastProvider } from "@heroui/toast";
import { createContext, useContext } from "react";

export interface ProviderProps{
    children: React.ReactNode,
    themeProp?: ThemeProviderProps
}

declare module "@react-types/shared" {
    interface RouterConfig {
      routerOptions: NonNullable<
        Parameters<ReturnType<typeof useRouter>["push"]>[1]
      >;
    }
  }
  
  // Create a context for ImageKit authentication
  export const ImageKitAuthContext = createContext<{
    authenticate: () => Promise<{
      signature: string;
      token: string;
      expire: number;
    }>;
  }>({
    authenticate: async () => ({ signature: "", token: "", expire: 0 }),
  });
  
  export const useImageKitAuth = () => useContext(ImageKitAuthContext);
  

const authenticatior = async () => {
    try {
        const response = await fetch("/api/imagekit-auth");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("authentication error:", error);
        throw error;
    }
};

export function Providers({children, themeProp}: ProviderProps) {
  const router = useRouter();
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} {...themeProp}>
      <HeroUIProvider navigate={router.push}>
        <IKContext
          authenticator={authenticatior}
          publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
        >
          <ToastProvider placement="top-right" />
          {children}
        </IKContext>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}