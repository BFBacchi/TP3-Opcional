import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const docRef = doc(db, 'products', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() })
      } else {
        setProduct(null)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) return <p>Cargando producto...</p>
  if (!product) return <p>Producto no encontrado.</p>

  return (
    <div className="container mt-5">
      <div className="columns">
        <div className="column is-one-third">
          <img src={product.image} alt={product.title} style={{ width: '100%' }} />
        </div>
        <div className="column">
          <h2 className="title">{product.title}</h2>
          <p className="subtitle">${product.price}</p>
          <p>{product.description}</p>
          <p><strong>Categoría:</strong> {product.category}</p>
        </div>
      </div>
    </div>
  )
}