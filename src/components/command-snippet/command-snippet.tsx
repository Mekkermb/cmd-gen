import React from "react";
import { Parameter } from "@/lib/definitions";

interface CommandSnippetProps {
  executable: string;
  parameters: Parameter[];
  values: Record<string, string | number>;
}

function CommandSnippet({
  executable,
  parameters,
  values,
}: CommandSnippetProps) {
  const commandParts = parameters.map((param) => {
    const value = values[param.key];
    if (value === "" || value === undefined) {
      return "";
    }

    let formattedValue = value;
    if (
      param.appendExtension &&
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      formattedValue = `${value}${param.appendExtension}`;
    }

    return `--${param.key} ${formattedValue}`;
  });

  const fullCommand = `${executable} ${commandParts.filter(Boolean).join(" ")}`;

  return (
    <div>
      <span>Command: </span>
      <code>{fullCommand.trim()}</code>
    </div>
  );
}

export default CommandSnippet;
