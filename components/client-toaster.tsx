"use client";

import * as React from "react";

import { Toaster } from "@/components/ui/sonner";

function ClientToaster() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Toaster position="bottom-right" richColors closeButton />;
}

export { ClientToaster };
