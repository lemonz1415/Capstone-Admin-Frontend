import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";

interface ButtonProps {
  title?: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  icon?: IconDefinition;
  bgColor:
    | "bg-primary-0"
    | "bg-primary-1"
    | "bg-primary-2"
    | "bg-primary-3"
    | "bg-primary-4"
    | "bg-primary-5"
    | "bg-red-0"
    | "bg-red-1"
    | "bg-red-2"
    | "bg-red-3"
    | "bg-gray-0"
    | "bg-gray-1"
    | "bg-gray-2"
    | "bg-gray-3"
    | "bg-green-0"
    | "bg-green-1"
    | "bg-green-2"
    | "bg-green-3"
    | "bg-yellow-0"
    | "bg-yellow-1"
    | "bg-yellow-2"
    | "bg-yellow-3";
  textColor?: string;
  fontSize?:
    | "heading-regularL"
    | "heading-regularM"
    | "heading-regularS"
    | "heading-boldL"
    | "heading-boldM"
    | "heading-boldS"
    | "body-regularL"
    | "body-regularM"
    | "body-regularS"
    | "body-boldL"
    | "body-boldM"
    | "body-boldS";
  padding?: string;
  shadow?: string;
}

export default function Button(props: ButtonProps) {
  //---------------------
  //   HANDLE
  //---------------------
  const coloring = () => {
    return props.bgColor || "bg-red-1";
  };

  const textColoring = () => {
    return props.textColor || "text-white";
  };

  //---------------------
  //   CONST
  //---------------------
  const fontSize = props.fontSize || "body-boldS";
  const padding = props.padding || "px-5 py-2";
  const shadow = props.shadow || "drop-shadow-lg";

  //---------------------
  //   RENDER
  //---------------------
  return (
    <button
      className={classNames(
        "rounded-[15px] flex justify-center items-center text-center hover:bg-gray-0 hover:text-black hover:duration-300 h-full w-full",
        {
          "cursor-pointer": !props.disabled,
          "cursor-not-allowed": props.disabled,
          "!bg-gray-0 !text-gray-2": props.disabled,
        },
        coloring(),
        textColoring(),
        fontSize,
        padding,
        shadow
      )}
      onClick={() => !props.disabled && props.onClick()}
      disabled={props.disabled}
    >
      {props.isLoading ? (
        <div className="text-2xl animate-spin">
          <FontAwesomeIcon icon={faSpinner} />
        </div>
      ) : (
        <div className="flex justify-center items-center space-x-2">
          {props.icon && <FontAwesomeIcon icon={props.icon} size="1x" />}
          {props.title && <p className={fontSize}>{props.title}</p>}
        </div>
      )}
    </button>
  );
}
