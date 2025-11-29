// src/components/Icon.jsx
import React from "react";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaArrowRight,
  FaLink,
  FaCrosshairs,
  FaSave,
  FaFilePdf,
} from "react-icons/fa";

const iconMap = {
  trash: FaTrash,
  edit: FaEdit,
  add: FaPlus,
  move: FaArrowRight,
  link: FaLink,
  target: FaCrosshairs,
  save: FaSave,
  pdf: FaFilePdf,
};

export function Icon({
  name,
  size = 16,
  color = "inherit",
  className = "",
  title = "",
}) {
  const Component = iconMap[name];
  return Component ? (
    <Component size={size} color={color} className={className} title={title} />
  ) : null;
}
