import React, { useContext, useState } from 'react'
const CartContext = React.createContext()

export const useCartStore = () => {
  return useContext(CartContext)
}

export default function CartProvider(props) {
  const [items, setItems] = useState([])

  const addToCart = (item) => {
    const index = items.findIndex((cartItem) => cartItem.id === item.id)
    if (index !== -1) return
    setItems([item, ...items])
  }

  const deleteFromCart = (idToDelete) => {
    // Filter out the item with the specified idToDelete
    const updatedItems = items.filter((item) => item.id !== idToDelete)

    // Update the state with the filtered array
    setItems(updatedItems)
  }

  return (
    <CartContext.Provider
      value={{
        cartList: items,
        addToCart,
        deleteFromCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  )
}
