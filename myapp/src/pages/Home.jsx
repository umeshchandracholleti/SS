import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.getProducts({ limit: 10 });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Sai Scientifics</h1>
          <p className="text-lg text-muted-foreground">
            Industrial Supplies & Equipment
          </p>
        </header>

        <div className="flex gap-4 mb-8">
          <Button onClick={loadProducts} disabled={loading}>
            {loading ? 'Loading...' : 'Load Products'}
          </Button>
          <Button variant="outline">Browse Categories</Button>
          <Button variant="secondary">Request Quote</Button>
        </div>

        {isAuthenticated && (
          <div className="bg-card p-4 rounded-lg border mb-8">
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.full_name || 'User'}!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  ₹{product.base_price}
                </span>
                <Button size="sm">Add to Cart</Button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No products loaded yet. Click "Load Products" to fetch data.</p>
          </div>
        )}
      </div>
    </main>
  );
}
