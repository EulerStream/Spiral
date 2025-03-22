"use client";

import {useParams} from "next/navigation";
import './page.css';

export default function WidgetPage() {

  const {widgetId} = useParams();

  if (!widgetId) {
    alert("No widgetId found in the URL!");
    return null;
  }

  return (
      <div>
        <h1>{widgetId}</h1>
      </div>
  );

}