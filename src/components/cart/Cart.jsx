import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeItemFromCart, updateItemQuantity, getCartTotal, clearCart, getItemCount } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Carrito de Compras</h1>
          <p>Tu carrito está vacío.</p>
          <Link to="/" className="button is-link mt-3">Volver a la tienda</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Carrito de Compras</h1>
        <div className="box">
          {cartItems.map(item => (
            <div key={item.id} className="columns is-vcentered is-mobile">
              <div className="column is-2">
                <figure className="image is-64x64">
                  <img src={item.image} alt={item.title} />
                </figure>
              </div>
              <div className="column">
                <p className="title is-6">{item.title}</p>
                <p className="subtitle is-6">${item.price.toFixed(2)}</p>
              </div>
              <div className="column is-3">
                <div className="field has-addons">
                  <div className="control">
                    <button 
                      className="button is-small" 
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                  </div>
                  <div className="control">
                    <input 
                      className="input is-small has-text-centered" 
                      type="number" 
                      value={item.quantity} 
                      readOnly // O podrías implementar onChange para actualizar directamente
                      style={{ width: '50px' }} 
                    />
                  </div>
                  <div className="control">
                    <button 
                      className="button is-small" 
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="column is-2 has-text-right">
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="column is-1 has-text-right">
                <button 
                  className="delete" 
                  aria-label="delete" 
                  onClick={() => removeItemFromCart(item.id)}
                ></button>
              </div>
            </div>
          ))}
        </div>

        <div className="level">
            <div className="level-left">
                <button className="button is-danger" onClick={clearCart}>
                    Vaciar Carrito
                </button>
            </div>
            <div className="level-right">
                <div className="has-text-right">
                    <p className="title is-4">Total: ${getCartTotal().toFixed(2)}</p>
                    <p className="subtitle is-6">{getItemCount()} item(s)</p>
                    <button className="button is-success is-fullwidth mt-3">Proceder al Pago (No implementado)</button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
} 