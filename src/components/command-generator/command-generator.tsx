"use client";

import React, { useEffect } from "react";
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

  const [selectedEncoder, setSelectedEncoder] = useImmer<Encoder>(() => {
    const encoderIdFromUrl = searchParams.get("encoder");
    return encoders.find((enc) => enc.id === encoderIdFromUrl) || encoders[0];
  });

  const [parameters, setParameters] = useImmer<Record<string, string | number>>(
    {},
  );

  function updateUrl(
    encoderId: string,
    params: Record<string, string | number>,
  ) {
    const urlParams = new URLSearchParams();
    urlParams.set("encoder", encoderId);
    Object.entries(params).forEach(([key, value]) => {
      urlParams.set(key, value.toString());
    });
    const url = `${pathname}?${urlParams.toString()}`;
    router.replace(url);
  }

  const debouncedUpdateUrl = useDebouncedCallback(
    (encoderId: string, params: Record<string, string | number>) => {
      updateUrl(encoderId, params);
    },
    300,
  );

  // Initialize parameters on component mount
  useEffect(() => {
    const initialParams: Record<string, string | number> = {};
    selectedEncoder.parameters.forEach((param) => {
      const urlValue = searchParams.get(param.key);
      initialParams[param.key] =
        urlValue !== null ? urlValue : param.defaultValue;
    });
    setParameters(initialParams);

    // Update URL with initial parameters
    updateUrl(selectedEncoder.id, initialParams);
  }, []);

  function handleEncoderChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newEncoderId = event.target.value;
    const newEncoder =
      encoders.find((enc) => enc.id === newEncoderId) || encoders[0];
    setSelectedEncoder(newEncoder);

    // Reset to default values when changing encoders
    const defaultParams: Record<string, string | number> = {};
    newEncoder.parameters.forEach((param) => {
      defaultParams[param.key] = param.defaultValue;
    });
    setParameters(defaultParams);
    updateUrl(newEncoder.id, defaultParams);
  }

  function updateParameter(key: string, value: string | number) {
    setParameters((draft) => {
      draft[key] = value;
    });

    // Debounced update for parameter changes
    debouncedUpdateUrl(selectedEncoder.id, { ...parameters, [key]: value });
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
            value={parameters[param.key] ?? param.defaultValue}
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
