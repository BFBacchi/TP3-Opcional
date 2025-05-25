import React, { createContext, useState, useEffect } from 'react';
import { db } from '../config/firebase'; // Ajusta la ruta si es necesario
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext'; // Importar useAuth

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const { currentUser } = useAuth();

  // Cargar carrito desde Firestore o localStorage
  useEffect(() => {
    const loadCart = async () => {
      setLoadingCart(true);
      if (currentUser) {
        const cartDocRef = doc(db, 'userCarts', currentUser.uid);
        const cartDocSnap = await getDoc(cartDocRef);
        if (cartDocSnap.exists()) {
          setCartItems(cartDocSnap.data().items || []);
        } else {
          setCartItems([]); // No cart in Firestore, start with empty
        }
      } else {
        const localData = localStorage.getItem('cartItems');
        setCartItems(localData ? JSON.parse(localData) : []);
      }
      setLoadingCart(false);
    };
    // Solo cargar si currentUser no es undefined (es decir, el estado de auth ya se resolvió)
    if (currentUser !== undefined) {
      loadCart();
    }
  }, [currentUser]);

  // Guardar carrito en Firestore o localStorage
  useEffect(() => {
    // No guardar si el estado de auth o el carrito aún están cargando
    if (loadingCart || currentUser === undefined) return;

    const saveCart = async () => {
      if (currentUser) {
        const cartDocRef = doc(db, 'userCarts', currentUser.uid);
        if (cartItems.length > 0) {
          await setDoc(cartDocRef, { items: cartItems });
        } else {
          // Si el carrito está vacío, y el documento existe en Firebase, eliminarlo
          const cartDocSnap = await getDoc(cartDocRef);
          if (cartDocSnap.exists()) {
             await deleteDoc(cartDocRef);
          }
        }
      } else {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }
    };
    saveCart();
  }, [cartItems, currentUser, loadingCart]);

  const addItemToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeItemFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateItemQuantity = (productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Renderizar children solo cuando el estado de auth y el carrito se hayan determinado
  if (loadingCart || currentUser === undefined) {
    return <p className="has-text-centered">Cargando datos de la aplicación...</p>; 
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        loadingCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 