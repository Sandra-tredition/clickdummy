import React from "react";
import { Plus, Trash2 } from "lucide-react";

type ButtonSize = "default" | "large" | "small";
type ButtonVariant =
  | "primary"
  | "primary-icon"
  | "secondary"
  | "secondary-icon"
  | "disabled"
  | "special";

interface ButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Button = ({
  size = "default",
  variant = "primary",
  children,
  className = "",
  icon,
  disabled = false,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  // Size classes
  const sizeClasses = {
    default: "h-8 px-[15px]",
    large: "h-10 px-[15px]",
    small: "h-6 px-[7px] text-xs",
  };

  // Variant classes
  const variantClasses = {
    primary:
      "bg-primary-green shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)] border border-primary-green",
    "primary-icon":
      "bg-primary-green shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)] border border-primary-green",
    secondary:
      "bg-white shadow-[0px_2px_0px_0px_rgba(0,0,0,0.02)] border border-[#d9d9d9]",
    "secondary-icon":
      "bg-white shadow-[0px_2px_0px_0px_rgba(0,0,0,0.02)] border border-[#d9d9d9]",
    disabled: "bg-[#ebebeb] text-gray-500 cursor-not-allowed",
    special: "bg-white border border-[#d9d9d9] text-special-red",
  };

  // Border radius based on size
  const radiusClasses = {
    default: "rounded-md",
    large: "rounded-lg",
    small: "rounded",
  };

  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${variantClasses[disabled ? "disabled" : variant]}
        ${radiusClasses[size]}
        flex items-center justify-center
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {variant.includes("icon") && icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );
};

const ButtonShowcase = () => {
  return (
    <div className="w-[1159px] h-[908px] relative bg-white overflow-hidden">
      {/* Yellow underline */}
      <div className="w-[129px] h-[3px] left-[-1px] top-[54px] absolute bg-[#ffee80]"></div>

      {/* Header */}
      <div className="left-[32px] top-[25px] absolute text-black text-base font-semibold font-barlow leading-normal">
        Button/Link
      </div>

      {/* Textlinks section header */}
      <div className="w-[706px] h-[42px] left-[32px] top-[663px] absolute">
        <div className="left-0 top-0 absolute text-black text-sm font-semibold font-barlow leading-tight">
          Primary
        </div>
        <div className="left-[163px] top-0 absolute text-black text-sm font-semibold font-barlow leading-tight">
          Primary Icon
        </div>
        <div className="left-[395px] top-0 absolute text-black text-sm font-semibold font-barlow leading-tight">
          Primary DarkBG
        </div>
      </div>

      {/* Button section header */}
      <div className="w-[1079px] h-[255px] left-[32px] top-[201px] absolute">
        <div className="left-[78px] top-0 absolute text-black text-sm font-semibold font-barlow leading-tight">
          Default Primary
        </div>
        <div className="left-[241px] top-0 absolute text-black text-sm font-semibold font-barlow leading-tight">
          Default Primary Icon
        </div>
        <div className="left-0 top-[89px] absolute text-black text-sm font-semibold font-barlow leading-tight">
          Default
        </div>
        <div className="left-0 top-[160px] absolute text-black text-sm font-semibold font-barlow leading-tight">
          Large
        </div>
        <div className="left-0 top-[235px] absolute text-black text-sm font-semibold font-barlow leading-tight">
          Small
        </div>
        <div className="left-[434px] top-0 absolute text-black text-sm font-semibold font-barlow leading-tight">
          Default Secondary
        </div>
        <div className="left-[615px] top-0 absolute text-black text-sm font-semibold font-barlow leading-tight">
          Default Secondary Icon
        </div>
        <div className="left-[825px] top-0 absolute text-black text-sm font-semibold font-barlow leading-tight">
          Disabled
        </div>
        <div className="left-[970px] top-0 absolute text-black text-sm font-semibold font-barlow leading-tight">
          Special
        </div>
      </div>

      {/* Dark blue background for Primary DarkBG */}
      <div className="w-[165px] h-14 left-[412px] top-[729px] absolute bg-dark-blue"></div>

      {/* Buttons section */}
      <div className="absolute left-[110px] top-[284px]">
        <Button>Button</Button>
      </div>

      <div className="absolute left-[277px] top-[284px]">
        <Button variant="primary-icon" icon={<Plus size={16} />}>
          Button
        </Button>
      </div>

      <div className="absolute left-[466px] top-[284px]">
        <Button variant="secondary">Button</Button>
      </div>

      <div className="absolute left-[641px] top-[284px]">
        <Button variant="secondary-icon" icon={<Trash2 size={16} />}>
          Button
        </Button>
      </div>

      <div className="absolute left-[857px] top-[284px]">
        <Button disabled>Button</Button>
      </div>

      {/* Special button */}
      <div className="absolute left-[1002px] top-[284px]">
        <div className="w-[87px] h-8 rounded-md border border-[#d9d9d9] flex items-center justify-center">
          <span className="text-special-red text-xs font-semibold font-barlow">
            Rabatte
          </span>
        </div>
      </div>

      {/* Large buttons */}
      <div className="absolute left-[110px] top-[353px]">
        <Button size="large">Button</Button>
      </div>

      <div className="absolute left-[277px] top-[353px]">
        <Button size="large" variant="primary-icon" icon={<Plus size={16} />}>
          Button
        </Button>
      </div>

      <div className="absolute left-[466px] top-[353px]">
        <Button size="large" variant="secondary">
          Button
        </Button>
      </div>

      <div className="absolute left-[641px] top-[353px]">
        <Button
          size="large"
          variant="secondary-icon"
          icon={<Trash2 size={16} />}
        >
          Button
        </Button>
      </div>

      <div className="absolute left-[857px] top-[353px]">
        <Button size="large" disabled>
          Button
        </Button>
      </div>

      {/* Small buttons */}
      <div className="absolute left-[110px] top-[434px]">
        <Button size="small">Button</Button>
      </div>

      <div className="absolute left-[277px] top-[434px]">
        <Button size="small" variant="primary-icon" icon={<Plus size={16} />}>
          Button
        </Button>
      </div>

      <div className="absolute left-[466px] top-[434px]">
        <Button size="small" variant="secondary">
          Button
        </Button>
      </div>

      <div className="absolute left-[641px] top-[434px]">
        <Button
          size="small"
          variant="secondary-icon"
          icon={<Trash2 size={16} />}
        >
          Button
        </Button>
      </div>

      <div className="absolute left-[857px] top-[434px]">
        <Button size="small" disabled>
          Button
        </Button>
      </div>

      {/* Section titles */}
      <div className="left-[32px] top-[106px] absolute text-black text-2xl font-semibold font-barlow leading-loose">
        Buttons
      </div>
      <div className="left-[32px] top-[568px] absolute text-black text-2xl font-semibold font-barlow leading-loose">
        Textlinks
      </div>
    </div>
  );
};

export default ButtonShowcase;
