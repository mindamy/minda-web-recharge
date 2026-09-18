"use client";

/**
 * Client-side access to the narrow message slice.
 *
 * This file deliberately imports **no catalogue**. It receives an
 * already-selected, already-serialised slice as a prop from a Server
 * Component parent (see `selectClientMessages` in `./dictionaries`). A static
 * `import … from "@/messages/…"` anywhere in the client graph bundles every
 * locale into the browser chunk with no error and no warning, and the site
 * still works perfectly in all three — which is exactly why the rule has to
 * be structural rather than remembered.
 *
 * Most `"use client"` files in this project never need this hook at all. The
 * motion and graphics wrappers take `children`; a rendered React element is
 * serialisable data, so a Server Component can render the copy and pass the
 * result through the boundary without either side importing the other.
 */

import { createContext, useContext, type ReactNode } from "react";

import type { ClientMessages } from "./types";

const MessagesContext = createContext<ClientMessages | null>(null);

export function MessagesProvider({
  messages,
  children,
}: {
  messages: ClientMessages;
  children: ReactNode;
}) {
  return <MessagesContext.Provider value={messages}>{children}</MessagesContext.Provider>;
}

/**
 * Throws rather than returning a default. A missing provider is a wiring bug
 * that would otherwise surface as silently absent nav labels.
 */
export function useMessages(): ClientMessages {
  const messages = useContext(MessagesContext);

  if (!messages) {
    throw new Error("useMessages must be used inside <MessagesProvider>.");
  }

  return messages;
}
