import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error al cargar el producto:', error)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p>Cargando detalle del producto...</p>
  if (!product) return <p>Producto no encontrado.</p>

  return (
    <div className="box">
      <button className="button is-light mb-4" onClick={() => navigate(-1)}>← Volver</button>

      <h1 className="title">{product.title}</h1>

      <figure className="image mb-4" style={{ maxWidth: '300px' }}>
        <img src={product.image} alt={product.title} />
      </figure>

      <p><strong>Precio:</strong> ${product.price}</p>
      <p><strong>Descripción:</strong> {product.description}</p>
      <button className="button is-primary mt-3">Comprar</button>
    </div>
  )
}
