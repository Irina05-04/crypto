import './button.scss';

type ButtonProps = {
  children: string;
  type: "button" | "submit" | "reset" | undefined;
  variant: "color" | "transparent";
  view: "round" | "square";
  size?: "small" | "medium" | "large" | "round-size";
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  id?: string;
};
export const Button = ({
  onClick,
  type = "button",
  id,
  children,
  disabled,
  variant = "color",
  view = 'square',
  size = "small",
}: ButtonProps) => {
  return (
    <button
      className={`button ${variant} ${size} ${view}`}
      type={type}
      onClick={onClick}
      id={id}
      disabled={disabled}
    >
      {children}
    </button>
  );
};