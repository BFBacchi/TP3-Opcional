import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ProductForm from './ProductForm';

export default function Backoffice() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    const productsCol = collection(db, "products");
    const productsSnapshot = await getDocs(productsCol);
    let productsList = [];
    productsSnapshot.forEach(docu => {
      productsList.push({ id: docu.id, ...docu.data() });
    });
    setProducts(productsList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", String(id)));
    fetchProducts();
  };

  const handleEdit = (prod) => {
    setEditing(prod);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="title">Backoffice - Gestión de Productos</h2>
      <button className="button is-primary mb-4" onClick={handleCreate}>
        Nuevo producto
      </button>

      {/* Modal */}
      <div className={`modal ${showModal ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={handleCloseModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{editing ? 'Editar producto' : 'Nuevo producto'}</p>
            <button className="delete" aria-label="close" onClick={handleCloseModal}></button>
          </header>
          <section className="modal-card-body">
            <ProductForm
              onSuccess={() => {
                fetchProducts();
                handleCloseModal();
              }}
              editing={editing}
              setEditing={setEditing}
              closeModal={handleCloseModal}
            />
          </section>
        </div>
      </div>

      <table className="table is-fullwidth is-striped mt-5">
        <thead>
          <tr>
            <th>Título</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id}>
              <td>{prod.title}</td>
              <td>${prod.price}</td>
              <td>{prod.category}</td>
              <td>
                <button
                  className="button is-small is-info mr-2"
                  onClick={() => handleEdit(prod)}
                >
                  Modificar
                </button>
                <button
                  className="button is-small is-danger"
                  onClick={() => handleDelete(prod.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}