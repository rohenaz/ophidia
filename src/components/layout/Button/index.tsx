import React, { CSSProperties } from "react";
import * as S from "./styles";

interface Props {
  className?: string;
  styles?: { text?: CSSProperties; wrapper?: CSSProperties };
  onClick?: Function;
  text?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  target?: string;
  color?: string;
}

const Button: React.FC<Props> = ({
  children,
  text,
  color,
  type = "button",
  styles,
  ...otherProps
}) => (
  <S.Button
    type={type}
    color={color}
    style={styles?.wrapper || {}}
    onClick={undefined as any}
    {...otherProps}
  >
    <>
      {children}
      <div style={styles?.text || {}}>{text}</div>
    </>
  </S.Button>
);

export default Button;
