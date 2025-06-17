import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./NoteModal.module.css";
import { NoteForm } from "../NoteForm/NoteForm";

interface NoteModalProps {
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ onClose }) => {
  useEffect(() => {
    // Відключаємо прокрутку сторінки при відкритті модалки
    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      // Відновлюємо прокрутку сторінки при закритті модалки
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Рендеримо портал безпосередньо в document.body
  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <NoteForm onClose={onClose} />
      </div>
    </div>,
    document.body
  );
};

export default NoteModal;
