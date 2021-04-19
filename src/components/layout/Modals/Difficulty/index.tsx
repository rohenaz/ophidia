import React from "react";
import { useGame } from "../../../../context/game";
import Button from "../../Button";
import Modal from "../Base";

interface Props {
  open: boolean;
  center?: boolean;
  blockScroll?: boolean;
  closeIcon?: React.ReactNode;
  classNames?: {
    overlay?: string;
    modal?: string;
    closeButton?: string;
    closeIcon?: string;
    animationIn?: string;
    animationOut?: string;
  };
  styles?: {
    overlay?: React.CSSProperties;
    modal?: React.CSSProperties;
    closeButton?: React.CSSProperties;
    closeIcon?: React.CSSProperties;
  };
  onClose: () => void;
  onEscKeyDown?: (event: KeyboardEvent) => void;
  onOverlayClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onAnimationEnd?: () => void;
  onSubmit: any;
}

const DifficultyModal: React.FC<Props> = ({
  open,
  onClose,
  closeIcon,
  classNames,
  styles,
  onSubmit,
}) => {
  const { setDifficulty, difficulty } = useGame();

  return (
    <Modal
      title="Difficulty"
      open={open}
      onClose={onClose}
      classNames={classNames}
      styles={styles}
    >
      <div className="py-12 text-center">
        <p className="leading-5 text-gray-500">Choose your skill level</p>
      </div>

      <div className="text-center">
        <span className="inline-flex rounded-md shadow-sm mr-4">
          <Button
            onClick={() => {
              setDifficulty(0);
              onSubmit();
            }}
            type="button"
            text="Apprentice"
            color={difficulty === 0 ? "#7356e5" : "#23233f"}
          />
        </span>
        <span className="inline-flex rounded-md shadow-sm">
          <Button
            onClick={() => {
              setDifficulty(1);
              onSubmit();
            }}
            type="button"
            color={difficulty === 1 ? "#7356e5" : "#23233f"}
            text="Hero"
          />
        </span>
      </div>
    </Modal>
  );
};

export default DifficultyModal;
