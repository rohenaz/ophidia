import React from "react";
import { useGame } from "../../../../context/game";
import modeSelectBgImg from "../../../../images/modeSelectBg.png";
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
      title="Choose Game Mode"
      open={open}
      onClose={onClose}
      classNames={classNames}
      styles={{ ...styles, modal: { width: 580, minWidth: "unset" } }}
    >
      <div
        className="relative text-center flex items-center justify-center mx-auto rounded-lg mt-8"
        style={{
          background: `url('${modeSelectBgImg}')`,
          width: "532px",
          height: "529px",
        }}
      >
        <span className="inline-flex rounded-md shadow-sm mr-20">
          <Button
            onClick={() => {
              setDifficulty(0);
              onSubmit();
            }}
            type="button"
            text="Young Hero"
            color={difficulty === 0 ? "#7356e5" : "#23233f"}
            styles={{ text: { fontSize: "1.25rem", padding: ".5rem" } }}
          />
        </span>
        <span className="inline-flex rounded-md shadow-sm ml-20">
          <Button
            onClick={() => {
              setDifficulty(1);
              onSubmit();
            }}
            type="button"
            color={difficulty === 1 ? "#7356e5" : "#23233f"}
            text="Hero"
            styles={{ text: { fontSize: "1.25rem", padding: ".5rem" } }}
          />
        </span>

        <div className="text-sm p-4 absolute bottom-0 mx-auto bg-gray-700 bg-opacity-75 text-gray-300 rounded-lg mb-8">
          <p>
            <span className="font-semibold">Young Hero</span> - Name of the
            cards
          </p>
          <p>
            <span className="font-semibold">Hero</span> - Card names and stats
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default DifficultyModal;
