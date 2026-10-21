import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";
import { PHOTOS } from "../config/company";
import { useLockScroll } from "../hooks/useScrollState";
import "./lightbox.css";

type OpenGallery = (photoIndex: number, subset?: number[]) => void;
const GalleryContext = createContext<OpenGallery>(() => {});
export const useGallery = () => useContext(GalleryContext);

/** Galeria ampliada: dialog nativo (foco preso, Esc fecha), setas, teclado e gesto de deslizar. */
export function GalleryProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<number[]>([]);
  const [pos, setPos] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const isOpen = pos !== null;
  useLockScroll(isOpen);

  const open = useCallback<OpenGallery>((photoIndex, subset) => {
    const ids = subset && subset.length ? subset : PHOTOS.map((_, i) => i);
    returnFocus.current = document.activeElement as HTMLElement | null;
    setList(ids);
    setPos(Math.max(0, ids.indexOf(photoIndex)));
    setDir(1);
  }, []);

  const close = useCallback(() => setPos(null), []);
  const step = useCallback(
    (delta: 1 | -1) => {
      setDir(delta);
      setPos((p) => (p === null ? p : (p + delta + list.length) % list.length));
    },
    [list.length],
  );

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (isOpen && !d.open) {
      if (typeof d.showModal === "function") d.showModal();
      else d.setAttribute("open", "");
    } else if (!isOpen && d.open) {
      d.close();
      returnFocus.current?.focus?.({ preventScroll: true });
    }
  }, [isOpen]);

  const photo = pos !== null ? PHOTOS[list[pos]] : null;
  const many = list.length > 1;

  return (
    <GalleryContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Fotos da frota"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onKeyDown={(e) => {
          if (!many) return;
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null || !many) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {photo && (
          <div className="lightbox__stage" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="lightbox__top">
              <span aria-live="polite">
                {pos! + 1} / {list.length}
              </span>
              <button type="button" className="round-btn" onClick={close} aria-label="Fechar galeria" autoFocus>
                <LuX aria-hidden="true" />
              </button>
            </div>
            <div className="lightbox__frame" onClick={(e) => e.target === e.currentTarget && close()}>
              <img key={list[pos!]} className={`lightbox__img from-${dir > 0 ? "right" : "left"}`} src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} />
              {many && (
                <>
                  <button type="button" className="round-btn lightbox__prev" onClick={() => step(-1)} aria-label="Foto anterior">
                    <LuChevronLeft aria-hidden="true" />
                  </button>
                  <button type="button" className="round-btn lightbox__next" onClick={() => step(1)} aria-label="Próxima foto">
                    <LuChevronRight aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            <p className="lightbox__cap">{photo.cap}</p>
          </div>
        )}
      </dialog>
    </GalleryContext.Provider>
  );
}
