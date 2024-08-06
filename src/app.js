import React, { useState } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import './app.css';

const App = () => {
  const [url, setUrl] = useState('');
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/products', { url });
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="App">
      <h1>Shopify Products</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://skinny.buywithai.shop/sitemap_products_1.xml"
      />
      <button onClick={fetchProducts}>Fetch Products</button>
      <div className="product-grid">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default app;
