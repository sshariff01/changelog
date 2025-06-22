"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type EditingContextType = {
  editingPostId: string | null;
  setEditingPostId: (id: string | null) => void;
  isConflictModalOpen: boolean;
  setConflictModalOpen: (isOpen: boolean) => void;
};

const EditingContext = createContext<EditingContextType | undefined>(undefined);

export function EditingProvider({ children }: { children: ReactNode }) {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isConflictModalOpen, setConflictModalOpen] = useState(false);

  return (
    <EditingContext.Provider
      value={{
        editingPostId,
        setEditingPostId,
        isConflictModalOpen,
        setConflictModalOpen,
      }}
    >
      {children}
    </EditingContext.Provider>
  );
}

export function useEditing() {
  const context = useContext(EditingContext);
  if (context === undefined) {
    throw new Error("useEditing must be used within an EditingProvider");
  }
  return context;
}