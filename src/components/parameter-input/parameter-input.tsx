import React from "react";
import { Parameter } from "@/lib/definitions";

interface ParameterInputProps {
  param: Parameter;
  value: string | number;
  onChange: (value: string | number) => void;
}

export function ParameterInput({
  param,
  value,
  onChange,
}: ParameterInputProps) {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const newValue =
      param.type === "range" ? Number(event.target.value) : event.target.value;
    onChange(newValue);
  };

  let input;
  if (param.type === "text") {
    input = (
      <input id={param.key} type="text" value={value} onChange={handleChange} />
    );
  } else if (param.type === "range") {
    input = (
      <>
        <input
          id={param.key}
          type="range"
          value={value}
          onChange={handleChange}
          min={param.min}
          max={param.max}
        />
        <span>{value}</span>
      </>
    );
  } else if (param.type === "select") {
    input = (
      <select id={param.key} value={value} onChange={handleChange}>
        {param.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div>
      <label htmlFor={param.key}>{param.label}: </label>
      {input}
    </div>
  );
}
