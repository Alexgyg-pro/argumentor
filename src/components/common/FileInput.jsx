// src/components/common/FileInput.jsx
export function FileInput({
  fileInputRef,
  onFileChange,
  accept = ".json",
  ...props
}) {
  return (
    <input
      type="file"
      ref={fileInputRef}
      onChange={onFileChange}
      accept={accept}
      style={{ display: "none" }}
      {...props}
    />
  );
}
