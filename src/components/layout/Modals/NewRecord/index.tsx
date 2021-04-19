import React, { useCallback, useState } from "react";
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
  score: number;
}

const NewRecordModal: React.FC<Props> = ({
  open,
  onClose,
  closeIcon,
  classNames,
  styles,
  onSubmit,
  score,
}) => {
  const [userName, setUserName] = useState<string>("");

  const handleChangeUserName = useCallback(
    (e: any) => {
      console.log("e", e.target.value);
      if (e.target.value) {
        setUserName(e.target.value);
      }
    },
    [setUserName]
  );

  return (
    <Modal
      title="New Record"
      open={open}
      onClose={onClose}
      classNames={classNames}
      styles={styles}
    >
      <div className="py-12">
        <p className="text-3xl text-center my-4">{score}</p>

        <p className="leading-5 text-gray-500 font-semibold">
          Congratulations!
        </p>
        <p className="leading-5 text-gray-500">
          You've earned a spot on the leaderboard!
        </p>
      </div>

      <div>
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Dorinthea Ironsong"
          onChange={handleChangeUserName}
        />
      </div>
      <br />

      <div className="text-right">
        <span className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => {
              onSubmit(userName);
            }}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
          >
            Save
          </button>
        </span>
      </div>
    </Modal>
  );
};

export default NewRecordModal;
