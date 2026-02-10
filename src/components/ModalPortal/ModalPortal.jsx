import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ModalPortal = ({ children }) => {
  const [containerEl, setContainerEl] = useState(null);

  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-modal-portal", "true");
    document.body.appendChild(el);
    setContainerEl(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  if (!containerEl) return null;
  return createPortal(children, containerEl);
};

export default ModalPortal;
