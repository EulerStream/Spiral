'use client'

import * as React from 'react'
import {EyeIcon, EyeOffIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {CopyButton} from "@/components/shared/copy-button";

const APIKeyDisplay = ({apiKey}: { apiKey: string }) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const last4 = apiKey.slice(-4);

  return (
      <div className="relative flex align-middle">
        {!showPassword && <div>
          <span className={"inline "} style={{lineHeight: "10px"}}>•••••••</span>
          <span style={{fontSize: "1px"}}>&nbsp;</span>
          <span className={"inline"}>{last4}</span>
        </div>}

        {showPassword && <div>
          <Input
            readOnly={true}
            className={"w-40"}
            value={apiKey}
            type={"text"}
          />
        </div>}
        <button
            onClick={() => setShowPassword(!showPassword)}
            className="ml-3 text-sm text-muted-foreground underline"
        >
          {
            showPassword ?
                <EyeOffIcon className="size-5" aria-hidden="true"/> :
                <EyeIcon className="size-5" aria-hidden="true"/>
          }
        </button>
      </div>
  )
};


APIKeyDisplay.displayName = 'APIKeyDisplay'

export {APIKeyDisplay};