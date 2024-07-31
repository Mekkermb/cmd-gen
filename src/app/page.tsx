import CommandGenerator from "@/components/command-generator";
import React from "react";

export default function Home() {
  return (
    <main>
      <React.Suspense fallback={<div>Loading...</div>}>
        <CommandGenerator />
      </React.Suspense>
    </main>
  );
}
