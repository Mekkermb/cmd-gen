"use client";

import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import CommandSnippet from "@/components/command-snippet";
import { ParameterInput } from "@/components/parameter-input";
import { encoders } from "@/lib/placeholder-data";
import { Encoder } from "@/lib/definitions";

export default function CommandGenerator() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [selectedEncoder, setSelectedEncoder] = useImmer<Encoder>(encoders[0]);
  const [parameters, setParameters] = useImmer<Record<string, string | number>>(
    {},
  );

  // Update URL function
  function updateUrl(
    encoderId: string,
    params: Record<string, string | number>,
  ) {
    const urlParams = new URLSearchParams();
    urlParams.set("encoder", encoderId);
    for (const [key, value] of Object.entries(params)) {
      urlParams.set(key, value.toString());
    }
    const url = `${pathname}?${urlParams.toString()}`;
    router.replace(url);
  }

  // Debounced URL update
  const debouncedUpdateUrl = useDebouncedCallback(updateUrl, 300);

  // Reset parameters when encoder changes
  useEffect(() => {
    const newParams: Record<string, string | number> = {};
    for (const param of selectedEncoder.parameters) {
      newParams[param.key] = param.defaultValue;
    }
    setParameters(newParams);
    updateUrl(selectedEncoder.id, newParams);
  }, [selectedEncoder]);

  // Handle encoder change
  function handleEncoderChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newEncoderId = event.target.value;
    const newEncoder =
      encoders.find((enc) => enc.id === newEncoderId) || encoders[0];
    setSelectedEncoder(newEncoder);
  }

  // Update parameter
  function updateParameter(key: string, value: string | number) {
    setParameters((draft) => {
      draft[key] = value;
    });
    debouncedUpdateUrl(selectedEncoder.id, parameters);
  }

  return (
    <>
      <div>
        <label htmlFor="encoder">Encoder: </label>
        <select
          id="encoder"
          value={selectedEncoder.id}
          onChange={handleEncoderChange}
        >
          {encoders.map((encoder) => (
            <option key={encoder.id} value={encoder.id}>
              {encoder.name}
            </option>
          ))}
        </select>
      </div>

      <section key={selectedEncoder.id} className="flex flex-col gap-4">
        {selectedEncoder.parameters.map((param) => (
          <ParameterInput
            key={param.key}
            param={param}
            value={parameters[param.key] || param.defaultValue}
            onChange={(value) => updateParameter(param.key, value)}
          />
        ))}
      </section>

      <CommandSnippet
        executable={selectedEncoder.executable || selectedEncoder.id}
        parameters={selectedEncoder.parameters}
        values={parameters}
      />
    </>
  );
}
