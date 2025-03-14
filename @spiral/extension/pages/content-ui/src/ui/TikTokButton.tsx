import {HTMLAttributes} from "react";

interface TikTokButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}


export const TikTokButton = (props: TikTokButtonProps) => {
  const {style, children, ...rest} = props;
  let background: string;

  switch (props.variant) {
    default:
    case "primary":
      background = "rgb(255, 59, 92)";
      break;
    case "secondary":
      background = "rgba(255, 255, 255, 0.08)";
  }

  return (
      <button
          {...rest}
          className={"flex justify-center items-center"}
          style={
            {
              ...{
                width: "140px",
                color: "white",
                fontFamily: 'TikTokFont',
                borderRadius: "4px",
                padding: "6px 8px",
                fontWeight: "600",
                fontSize: "16px",
                background: background,
              },
              ...style
            }
          }
      >
        {children}
      </button>
  )
}