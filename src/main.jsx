import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FreedomV6 from "../freedom-v6.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FreedomV6 />
  </StrictMode>
);
