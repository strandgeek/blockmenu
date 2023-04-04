import { useContext } from "react"
import { orderContext } from "../providers/OrderProvider"

export const useOrder = () => {
  return useContext(orderContext);
}
