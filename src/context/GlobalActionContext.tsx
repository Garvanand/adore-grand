"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ImBlockedWorkflowModal } from "@/components/incident/ImBlockedWorkflowModal";
import { AddVehicleModal } from "@/components/vehicle/AddVehicleModal";

interface GlobalActionContextType {
  openFindVehicle: () => void;
  openImBlocked: () => void;
  openRegisterVehicle: () => void;
  closeModals: () => void;
  isBlockedModalOpen: boolean;
  isRegisterVehicleOpen: boolean;
}

const GlobalActionContext = createContext<GlobalActionContextType | undefined>(undefined);

export function GlobalActionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [isRegisterVehicleOpen, setIsRegisterVehicleOpen] = useState(false);

  // Check query parameters on load/navigation (e.g. /?blocked=true or /?register=true or /?search=true)
  useEffect(() => {
    if (searchParams.get("blocked") === "true") {
      setIsBlockedModalOpen(true);
    }
    if (searchParams.get("register") === "true") {
      setIsRegisterVehicleOpen(true);
    }
    if (searchParams.get("search") === "true") {
      if (pathname === "/") {
        setTimeout(() => {
          const el = document.getElementById("vehicle-search-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [pathname, searchParams]);

  const openFindVehicle = () => {
    if (pathname === "/") {
      const el = document.getElementById("vehicle-search-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/?search=true");
    }
  };

  const openImBlocked = () => {
    setIsBlockedModalOpen(true);
  };

  const openRegisterVehicle = () => {
    setIsRegisterVehicleOpen(true);
  };

  const closeModals = () => {
    setIsBlockedModalOpen(false);
    setIsRegisterVehicleOpen(false);
  };

  return (
    <GlobalActionContext.Provider
      value={{
        openFindVehicle,
        openImBlocked,
        openRegisterVehicle,
        closeModals,
        isBlockedModalOpen,
        isRegisterVehicleOpen,
      }}
    >
      {children}

      {/* Shared Global Modals */}
      {isBlockedModalOpen && (
        <ImBlockedWorkflowModal
          isOpen={isBlockedModalOpen}
          onClose={() => setIsBlockedModalOpen(false)}
        />
      )}
      {isRegisterVehicleOpen && (
        <AddVehicleModal
          isOpen={isRegisterVehicleOpen}
          onClose={() => setIsRegisterVehicleOpen(false)}
        />
      )}
    </GlobalActionContext.Provider>
  );
}

export function useGlobalActions() {
  const context = useContext(GlobalActionContext);
  if (!context) {
    throw new Error("useGlobalActions must be used within a GlobalActionProvider");
  }
  return context;
}
