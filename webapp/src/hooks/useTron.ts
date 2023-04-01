import { useContext } from "react";
import { tronContext } from "../contexts/tron";

export const useTron = () => useContext(tronContext);
