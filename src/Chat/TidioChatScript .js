import React, { useEffect } from "react";

const TidioChatScript = () => {
  useEffect(() => {
    const tidioScript = document.createElement("script");
    tidioScript.src = "//code.tidio.co/zwtqs1qfensaeep6a7viqkokomtgpgat.js";
    tidioScript.async = true;
    document.body.appendChild(tidioScript);

    return () => {
      document.body.removeChild(tidioScript);
    };
  }, []);

  return null;
};

export default TidioChatScript;
