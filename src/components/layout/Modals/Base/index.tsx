import React, { useCallback, useEffect } from "react";
import Transition from "../../../Transition";
import Button from "../../Button";
import * as S from "./styles";

export type BaseModalProps = {
  title?: string;
  classNames?: {
    closeButton?: string;
    modal?: string;
    overlay?: string;
    title?: string;
  };
  styles?: {
    closeButton?: React.CSSProperties;
    modal?: React.CSSProperties;
    overlay?: React.CSSProperties;
  };
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  onClose?: () => void;
  onSubmit?: () => void;
  onEscKeyDown?: (event: KeyboardEvent) => void;
  onOverlayClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  open: boolean;
  submitText?: string;
  children: any;
};

// TODO: Implement call to onClose
// TODO: Implement call to onOverlayClick

const BaseModal: React.FC<BaseModalProps> = ({
  classNames,
  icon,
  onClose,
  onEscKeyDown,
  onOverlayClick,
  onSubmit,
  open,
  submitText,
  title,
  children,
  styles,
  ...otherProps
}) => {
  const escFunction = useCallback(
    (event) => {
      if (onEscKeyDown && event.keyCode === 27) {
        onEscKeyDown(event);
      }
    },
    [onEscKeyDown]
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (onEscKeyDown) {
      document.addEventListener("keydown", escFunction, false);

      return () => {
        document.removeEventListener("keydown", escFunction, false);
      };
    }
    return;
  }, [escFunction, onEscKeyDown]);

  return (
    <>
      <Transition
        show={open}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {open ? (
          <S.Backdrop
            onClick={onOverlayClick}
            className={classNames?.overlay}
            style={styles?.overlay}
          >
            <S.Modal
              classProvided={classNames?.modal !== undefined}
              className={classNames?.modal}
              style={styles?.modal}
              onClick={(e: any) => {
                e.stopPropagation();
              }}
              {...otherProps}
            >
              <div
                className={`flex items-center justify-between ${
                  classNames?.title || ""
                }`}
              >
                {title && (
                  <S.Title>
                    {icon && icon({ className: "w-4 h-4 mr-1" })}
                    {title}
                  </S.Title>
                )}
                <p onClick={onClose} className="cursor-pointer">
                  <S.CloseIcon
                    classProvided={classNames?.closeButton !== undefined}
                    className={classNames?.closeButton}
                    style={styles?.closeButton}
                  />
                </p>
              </div>

              {children}

              {onSubmit !== undefined && (
                <div className="flex justify-end">
                  <Button text={submitText || "Submit"} onClick={onSubmit} />
                </div>
              )}
            </S.Modal>
          </S.Backdrop>
        ) : (
          <div />
        )}
      </Transition>
    </>
  );
};

export default BaseModal;
