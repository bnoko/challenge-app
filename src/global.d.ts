// global.d.ts
// This file contains global TypeScript type declarations for the application.
// Use it to extend built-in global objects (e.g., Window) or declare types used across the entire app.
//
// Example:
// - Extending the `Window` object to include custom properties like `handleSignInWithGoogle`.
// - Adding other global type definitions as the app grows.
//
// IMPORTANT: Changes here affect the entire project. Use carefully!


export {};

// declare global {
//     interface Window {
//       handleSignInWithGoogle: (response: { credential: string }) => void;
//     }
// }

declare global {
  interface Window {
    handleSignInWithGoogle: (response: { credential: string }) => void;
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: {
              type: string;
              theme: string;
              size: string;
              text: string;
              shape: string;
              logo_alignment: string;
            }
          ) => void;
        };
      };
    };
  }
}
