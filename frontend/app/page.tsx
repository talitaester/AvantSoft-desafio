'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  missingLetter: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sku: ''
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:8080/products';

  // Buscar produtos da API
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setError('');
      
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      
      const productsData: Product[] = await response.json();
      // Ordenar por nome
      const sortedProducts = productsData.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao carregar produtos: ' + (error as Error).message);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Carregar produtos ao iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  // Manipular mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Limpar formulário
  const clearForm = () => {
    setFormData({ name: '', price: '', sku: '' });
    setEditingProduct(null);
    setError('');
  };

  // Criar ou atualizar produto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || !formData.sku.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    const priceValue = parseFloat(formData.price);
    if (priceValue <= 0 || isNaN(priceValue)) {
      setError('O preço deve ser maior que zero');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const productData = {
        name: formData.name.trim(),
        price: priceValue,
        sku: formData.sku.trim()
      };

      let response;
      
      if (editingProduct) {
        // Atualizar produto existente
        response = await fetch(`${API_BASE_URL}/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      } else {
        // Criar novo produto
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar produto');
      }

      // Recarregar a lista de produtos
      await fetchProducts();
      
      // Limpar formulário
      clearForm();
      
      alert(`Produto ${editingProduct ? 'atualizado' : 'cadastrado'} com sucesso!`);
      
    } catch (error) {
      console.error( error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Editar produto
  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      sku: product.sku
    });
    setEditingProduct(product);
    setError('');
  };

  // Excluir produto
  const handleDelete = async (productId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir produto');
      }

      // Recarregar a lista de produtos
      await fetchProducts();
      
      alert('Produto excluído com sucesso!');
      
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      setError('Erro ao excluir produto: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🛍️ Sistema de Produtos
            </h1>
            <p className="text-gray-600">
              Cadastre, edite e gerencie seus produtos
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-black mb-6">
                {editingProduct ? '✏️ Editar Produto' : '📝 Cadastrar Produto'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Laptop Gamer"
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="Ex: 999.99"
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: PROD-001"
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <span>{editingProduct ? '💾' : '✅'}</span>
                        {editingProduct ? 'Atualizar' : 'Cadastrar'}
                      </>
                    )}
                  </button>

                  {editingProduct && (
                    <button 
                      type="button"
                      onClick={clearForm}
                      disabled={loading}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  📦 Lista de Produtos
                </h2>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {products.length} {products.length === 1 ? 'item' : 'itens'}
                </span>
              </div>
              
              {loadingProducts ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 text-gray-300">📦</div>
                  <p className="text-gray-500 text-lg mb-2">Nenhum produto cadastrado.</p>
                  <p className="text-gray-400">Use o formulário ao lado para adicionar o primeiro produto!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
                          <p><strong>SKU:</strong> {product.sku}</p>
                          <p className="flex items-center gap-1">
                            <strong>Letra ausente:</strong> 
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                              {product.missingLetter}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                          title="Editar produto"
                        >
                          <span>✏️</span>
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                          title="Excluir produto"
                        >
                          <span>🗑️</span>
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}