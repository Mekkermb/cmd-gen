import { useImmer } from "use-immer";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Parameter } from "@/lib/definitions";

export function useParameter(param: Parameter, updateURLParams: () => void) {
  const searchParams = useSearchParams();

  // Initialize value from URL or default
  const [value, updateValue] = useImmer(() => {
    const urlValue = searchParams.get(param.key);
    return urlValue !== null ? urlValue : param.defaultValue;
  });

  // Debounced function to update value and trigger URL update
  const handleChange = useDebouncedCallback((newValue: string | number) => {
    updateValue(newValue);
    updateURLParams();
  }, 500);

  return [value, handleChange] as const;
}
