import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, getDocs, setDoc, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import '../../App.css';

const PRODUCTS_PER_PAGE = 10;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);

  const { addItemToCart } = useContext(CartContext);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      if (currentUser) {
        const favDocRef = doc(db, 'userFavorites', currentUser.uid);
        const favDocSnap = await getDoc(favDocRef);
        if (favDocSnap.exists()) {
          setFavorites(favDocSnap.data().productIds || []);
        } else {
          setFavorites([]);
        }
      } else {
        const savedFavorites = localStorage.getItem('favorites');
        setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
      }
    };
    loadFavorites();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);
 
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setLoading(true);
      const productsCol = collection(db, "products");
      const productsSnapshot = await getDocs(productsCol);
      let productsList = [];
      productsSnapshot.forEach(doc => {
        productsList.push({ id: doc.id, ...doc.data() });
      });

      if (productsList.length === 0) {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        for (const prod of data) {
          await setDoc(doc(productsCol, String(prod.id)), prod);
        }
        setProducts(data);
      } else {
        setProducts(productsList);
      }

      try {
        const catRes = await fetch('https://fakestoreapi.com/products/categories');
        const catData = await catRes.json();
        setCategories(catData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
      
      setLoading(false);
    };
    fetchProductsAndCategories();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const toggleFavorite = async (productId) => {
    const isFavorite = favorites.includes(productId);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(id => id !== productId);
    } else {
      updatedFavorites = [...favorites, productId];
    }
    setFavorites(updatedFavorites);

    if (currentUser) {
      const favDocRef = doc(db, 'userFavorites', currentUser.uid);
      try {
        if (isFavorite) {
          await updateDoc(favDocRef, { productIds: arrayRemove(productId) });
        } else {
          const favDocSnap = await getDoc(favDocRef);
          if (favDocSnap.exists()){
            await updateDoc(favDocRef, { productIds: arrayUnion(productId) });
          } else {
            await setDoc(favDocRef, { productIds: [productId] });
          }
        }
      } catch (error) {
        console.error("Error updating favorites in Firestore:", error);
        setFavorites(favorites);
      }
    }
  };

  const handleAddToCart = (product) => {
    if (!currentUser) {
      Swal.fire({
        title: '¡Necesitas iniciar sesión!',
        text: 'Para añadir productos al carrito, primero debes iniciar sesión',
        icon: 'warning',
        confirmButtonText: 'Ir a Login',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }
    addItemToCart(product);
  };

  const filteredProducts = products
    .filter(product => 
      selectedCategory ? product.category === selectedCategory : true
    )
    .filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  if (loading) return <p>Cargando productos...</p>;

  return (
    <div>
      <h1 className="title">Productos</h1>

      <div className="columns is-vcentered mb-5">
        <div className="column is-half">
          <div className="field">
            <label className="label" htmlFor="search-input">Buscar Productos</label>
            <div className="control">
              <input
                id="search-input"
                className="input"
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="column is-half">
          <div className="field">
            <label className="label" htmlFor="category-select">Filtrar por Categoría</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="">Todas las categorías</option>
                  {categories && categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="columns is-multiline">
        {currentProducts.map(product => (
          <div className="column is-one-quarter" key={product.id}>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="card-image" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <figure className="image" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    style={{ 
                      maxHeight: '100%', 
                      maxWidth: '100%', 
                      objectFit: 'contain' 
                    }} 
                  />
                </figure>
              </div>
              <div className="card-content" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div className="media">
                  <div className="media-content">
                    <p className="title is-6" style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.5em'
                    }}>
                      {product.title}
                    </p>
                  </div>
                  <div className="media-right">
                    <button 
                      className="button is-ghost" 
                      onClick={() => toggleFavorite(product.id)}
                      aria-label={favorites.includes(product.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                      <span className="icon is-small">
                        {favorites.includes(product.id) ? '❤️' : '♡'}
                      </span>
                    </button>
                  </div>
                </div>
                <p className="has-text-weight-bold">${product.price}</p>
                <div className="buttons mt-2" style={{ marginTop: 'auto' }}>
                  <Link to={`/product/${product.id}`} className="button is-link is-small">
                    Ver más
                  </Link>
                  <button 
                    className="button is-success is-small" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 0 && (
      <nav className="pagination is-centered mt-5" role="navigation" aria-label="pagination">
        <button
          className="pagination-previous"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <button
          className="pagination-next"
          onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || currentProducts.length === 0}
        >
          Siguiente
        </button>
        <ul className="pagination-list">
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <button
                className={`pagination-link ${currentPage === index + 1 ? 'is-current' : ''}`}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      )}
    </div>
  );
}