import React from "react";

function CommandSnippet({ code }: { code: string }) {
  return (
    <div>
      Command: <span>./SvtAv1EncApp {code}</span>
    </div>
  );
}

export default React.memo(CommandSnippet);
