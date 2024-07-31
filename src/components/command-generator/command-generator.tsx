"use client";

import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

import CommandSnippet from "@/components/command-snippet";
import { useDebouncedCallback } from "use-debounce";

export default function CommandGenerator() {
  const [input, updateInput] = useImmer("");
  const [output, updateOutput] = useImmer("");
  const [preset, updatePreset] = useImmer(10);
  const [crf, updateCrf] = useImmer(35);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    // Initialize state from URL params
    updateInput(searchParams.get("input") || "");
    updateOutput(searchParams.get("output") || "");
    updatePreset(Number(searchParams.get("preset")) || 10);
    updateCrf(Number(searchParams.get("crf")) || 35);
  }, [searchParams, updateInput, updateOutput, updatePreset, updateCrf]);

  const updateURLParams = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries({ input, output, preset, crf })) {
      if (value !== "") {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  function handleInputChange(value: string) {
    updateInput(value);
    updateURLParams();
  }

  function handleOutputChange(value: string) {
    updateOutput(value);
    updateURLParams();
  }

  function handlePresetChange(value: number) {
    updatePreset(value);
    updateURLParams();
  }

  function handleCrfChange(value: number) {
    updateCrf(value);
    updateURLParams();
  }

  function generateCommand(
    input: string,
    output: string,
    preset: number,
    crf: number,
  ) {
    return `--i ${input} --progress 3 --preset ${preset} --crf ${crf} --b ${output}`;
  }

  const commandCode = React.useDeferredValue(
    generateCommand(input, output, preset, crf),
  );

  return (
    <>
      <section className="flex flex-col gap-4">
        <label htmlFor="input">input: </label>
        <input
          id="input"
          type="text"
          value={input}
          onChange={(event) => handleInputChange(event.target.value)}
        />

        <label htmlFor="preset">preset: {preset} </label>
        <input
          id="preset"
          type="range"
          min={-3}
          max={13}
          value={preset}
          onChange={(event) => handlePresetChange(Number(event.target.value))}
        />

        <label htmlFor="crf">crf: {crf} </label>
        <input
          id="crf"
          type="range"
          min={1}
          max={63}
          value={crf}
          onChange={(event) => handleCrfChange(Number(event.target.value))}
        />

        <label htmlFor="output">output: </label>
        <input
          id="output"
          type="text"
          value={output}
          onChange={(event) => handleOutputChange(event.target.value)}
        />
      </section>
      <CommandSnippet code={commandCode} />
    </>
  );
}
