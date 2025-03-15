"use client";

import './swaggerDoc.scss';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css"

export const SwaggerComponent = ({data}: {data: any}) => {
  return (
      <SwaggerUI tryItOutEnabled={true}  spec={data}  />
  )
}

