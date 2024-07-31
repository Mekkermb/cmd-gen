import { Encoder } from "./definitions";

export const encoders: Encoder[] = [
  {
    id: "svt-av1",
    name: "SVT-AV1",
    executable: "SvtAv1EncApp",
    parameters: [
      {
        key: "input",
        label: "Input",
        type: "text",
        defaultValue: "",
        appendExtension: ".y4m",
      },
      {
        key: "output",
        label: "Output",
        type: "text",
        defaultValue: "",
        appendExtension: ".ivf",
      },
      {
        key: "preset",
        label: "Preset",
        type: "range",
        defaultValue: 10,
        min: -3,
        max: 13,
      },
      {
        key: "crf",
        label: "CRF",
        type: "range",
        defaultValue: 35,
        min: 1,
        max: 63,
      },
    ],
  },

  {
    id: "x265",
    name: "x265",
    parameters: [
      { key: "input", label: "Input", type: "text", defaultValue: "" },
      { key: "output", label: "Output", type: "text", defaultValue: "" },
      {
        key: "preset",
        label: "Preset",
        type: "select",
        defaultValue: "medium",
        options: [
          "ultrafast",
          "superfast",
          "veryfast",
          "faster",
          "fast",
          "medium",
          "slow",
          "slower",
          "veryslow",
          "placebo",
        ],
      },
      {
        key: "crf",
        label: "CRF",
        type: "range",
        defaultValue: 23,
        min: 0,
        max: 51,
      },
    ],
  },
  // Add more encoders as needed
];
