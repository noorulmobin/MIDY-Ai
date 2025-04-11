"use client";
import { cn } from "@/lib/utils";
import { createScopedLogger } from "@/utils";
import { ReactNode, useEffect, useRef } from "react";

/**
 * 底部弹出的组件
 * dropup from bottom
 * @param props
 * @returns
 */
const DropupMenu = (props: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) => {
  const logger = createScopedLogger("Home");

  const {
    onClose,
    children,
    open,
    className: classNameFromParent = "",
  } = props;

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dom = modalRef.current;
    if (!dom) {
      return;
    }
    if (open) {
      document.body.appendChild(dom);
    }
    return () => {
      try {
        if (dom && document.body.contains(dom)) {
          document.body.removeChild(dom);
        }
      } catch (e) {
        logger.error(e);
      }
    };
  }, [open, logger]);
  return (
    <>
      <div className="hidden">
        {/* dom，插入到body下显示 */}
        {/* dom, append to body */}
        <div
          className={`${open ? "absolute" : "hidden"} bottom-0 left-0 right-0 top-0 z-10 flex flex-col justify-end`}
          ref={modalRef}
        >
          <div
            className="absolute bottom-0 left-0 right-0 top-0 z-0 box-content bg-slate-400 opacity-55 dark:bg-slate-400"
            onClick={() => onClose()}
          ></div>
          <div
            className={cn(
              `relative z-10 mx-auto flex h-4/5 flex-col rounded-tl-lg rounded-tr-lg border-l-2 border-r-2 border-t-2 border-purple-700 bg-card p-2 shadow dark:border-slate-50`,
              classNameFromParent
            )}
          >
            <div className="flex flex-1 flex-col overflow-auto">
              {children}
              <div className="min-h-20 w-full md:min-h-0"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DropupMenu;
