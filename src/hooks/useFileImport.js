// src/hooks/useFileImport.js
import { useRef, useCallback } from "react";

export function useFileImport(onFileSelected) {
  const fileInputRef = useRef(null);

  const handleImportInit = useCallback(() => {
    console.log("🔄 useFileImport: Initialisation import");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files[0];

      if (file && onFileSelected) {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  return {
    fileInputRef,
    handleImportInit,
    handleFileChange,
  };
}
