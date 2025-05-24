import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { setDoc, doc } from 'firebase/firestore';

export default function ProductForm({ onSuccess, editing, setEditing, closeModal }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || '');
      setPrice(editing.price?.toString() || '');
      setCategory(editing.category || '');
      setDescription(editing.description || '');
      setImage(editing.image || '');
    } else {
      setTitle('');
      setPrice('');
      setCategory('');
      setDescription('');
      setImage('');
    }
    setError('');
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = editing ? String(editing.id) : Date.now().toString();
      await setDoc(doc(db, "products", id), {
        title,
        price: Number(price),
        category,
        description,
        image
      });
      if (setEditing) setEditing(null);
      if (closeModal) closeModal();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Error al guardar el producto');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="box">
      <div className="field">
        <label className="label">Título</label>
        <div className="control">
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
      </div>
      <div className="field">
        <label className="label">Precio</label>
        <div className="control">
          <input className="input" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
      </div>
      <div className="field">
        <label className="label">Categoría</label>
        <div className="control">
          <input className="input" value={category} onChange={e => setCategory(e.target.value)} required />
        </div>
      </div>
      <div className="field">
        <label className="label">Descripción</label>
        <div className="control">
          <textarea className="textarea" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
      </div>
      <div className="field">
        <label className="label">Imagen (URL)</label>
        <div className="control">
          <input className="input" value={image} onChange={e => setImage(e.target.value)} required />
        </div>
      </div>
      {error && <p className="has-text-danger">{error}</p>}
      <button className="button is-primary" type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
      <button
        className="button is-light ml-2"
        type="button"
        onClick={() => {
          if (setEditing) setEditing(null);
          if (closeModal) closeModal();
        }}
      >
        Cancelar
      </button>
    </form>
  );
}