import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Encoder } from "@/lib/definitions";

export function useEncoderParameters(
  encoder: Encoder,
  updateURL: (params: URLSearchParams) => void,
) {
  const searchParams = useSearchParams();
  const [parameters, updateParameters] = useImmer<
    Record<string, string | number>
  >({});

  // Initialize parameters from URL or default values
  useEffect(() => {
    updateParameters((draft) => {
      encoder.parameters.forEach((param) => {
        const urlValue = searchParams.get(param.key);
        draft[param.key] = urlValue !== null ? urlValue : param.defaultValue;
      });
    });
  }, [encoder, searchParams, updateParameters]);

  // Update a single parameter
  const updateParameter = (key: string, value: string | number) => {
    updateParameters((draft) => {
      draft[key] = value;
    });
  };

  // Debounced function to update URL with current parameters
  const debouncedUpdateURL = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    Object.entries(parameters).forEach(([key, value]) => {
      if (value !== "") {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    updateURL(params);
  }, 500);

  // Trigger URL update when parameters change
  useEffect(() => {
    debouncedUpdateURL();
  }, [debouncedUpdateURL, parameters]);

  return { parameters, updateParameter };
}
