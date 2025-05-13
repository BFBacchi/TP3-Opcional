import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../config/firebase'
import { collection, getDocs, setDoc, doc } from 'firebase/firestore'

const PRODUCTS_PER_PAGE = 10

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const productsCol = collection(db, "products")
      const productsSnapshot = await getDocs(productsCol)
      let productsList = []
      productsSnapshot.forEach(doc => {
        productsList.push({ id: doc.id, ...doc.data() })
      })

      if (productsList.length === 0) {
        // Si no hay productos en Firestore, los traemos de la API y los guardamos
        const res = await fetch('https://fakestoreapi.com/products')
        const data = await res.json()
        for (const prod of data) {
         await setDoc(doc(productsCol, String(prod.id)), prod)
        }
        setProducts(data)
      } else {
        setProducts(productsList)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const currentProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) return <p>Cargando productos...</p>

  return (
    <div>
      <h1 className="title">Productos</h1>
      <div className="columns is-multiline">
        {currentProducts.map(product => (
          <div className="column is-one-quarter" key={product.id}>
            <div className="card">
              <div className="card-image">
                <figure className="image is-4by3">
                  <img src={product.image} alt={product.title} />
                </figure>
              </div>
              <div className="card-content">
                <p className="title is-6">{product.title}</p>
                <p>${product.price}</p>
                <Link to={`/product/${product.id}`} className="button is-link is-small mt-2">
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Paginación */}
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
          disabled={currentPage === totalPages}
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
    </div>
  )
}