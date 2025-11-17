// src/components/common/HiddenFileInput.jsx
export function HiddenFileInput({ fileInputRef, onFileSelect }) {
  return (
    <input
      type="file"
      ref={fileInputRef}
      onChange={onFileSelect}
      accept=".json"
      style={{ display: "none" }}
    />
  );
}
