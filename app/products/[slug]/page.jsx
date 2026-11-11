'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { formatNaira } from '@/lib/utils';
import { 
  ShoppingCart, 
  Check, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const { slug } = params;

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setActiveImage(data.product.images?.[0] || '/assets/live-chicken-pasture.webp');
          
          // Fetch related products in category
          if (data.product.categoryId) {
            const relRes = await fetch(`/api/products?categoryId=${data.product.categoryId}`);
            const relData = await relRes.json();
            if (relData.products) {
              setRelated(relData.products.filter(p => p.id !== data.product.id).slice(0, 4));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cream-50">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-gray-500">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-cream-50">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 text-center">
          <AlertCircle className="w-12 h-12 text-forest-700 mx-auto mb-3" />
          <h2 className="text-2xl font-serif font-bold text-gray-900">Product Not Found</h2>
          <p className="text-sm text-gray-600 mt-2">The product you requested might have been moved or archived by farm administration.</p>
          <Link href="/products" className="inline-block mt-6 px-6 py-3 bg-forest-800 text-white rounded-xl text-sm font-semibold shadow">
            Return to Catalogue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isSale = product.promotionalPrice && product.promotionalPrice < product.price;
  const activePrice = isSale ? product.promotionalPrice : product.price;
  const isOutOfStock = !product.isAvailable || product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(product, quantity);
    if (res.success) {
      setJustAdded(true);
      setFeedback('Product added to your cart!');
      setTimeout(() => {
        setJustAdded(false);
        setFeedback('');
      }, 2000);
    } else {
      setFeedback(res.message);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ['/assets/live-chicken-pasture.webp'];

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950">
      <Navbar />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-forest-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-forest-700">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-forest-700">Products</Link>
            <span>/</span>
            <span className="text-forest-900 font-semibold truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to all products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-forest-100 shadow-sm">
            
            {/* Left: Product Images */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image */}
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-forest-50 border border-forest-100 shadow-inner">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {isSale && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-forest-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase shadow">
                    Sale
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        activeImage === img ? 'border-forest-700 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-2.5 py-0.5 rounded-full">
                    {product.categoryName || 'Farm Product'}
                  </span>
                  {product.isFeatured && (
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      ★ Featured Choice
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 leading-snug">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-forest-900">
                    {formatNaira(activePrice)}
                  </span>
                  {isSale && (
                    <span className="text-base text-gray-400 line-through">
                      {formatNaira(product.price)}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 font-medium">({product.unit})</span>
                </div>

                {/* Stock Indicator */}
                <div className="mt-3 flex items-center gap-2">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      <AlertCircle className="w-3.5 h-3.5" /> Currently Out of Stock
                    </span>
                  ) : product.stock <= 10 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
                      <Sparkles className="w-3.5 h-3.5" /> Low Stock: Only {product.stock} {product.unit} remaining
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} {product.unit} available)
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mt-6 border-t border-forest-100 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Specifications if any */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mt-6 border-t border-forest-100 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Specifications</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(product.specifications).map(([k, v]) => (
                        <div key={k} className="p-2.5 rounded-lg bg-cream-50 border border-forest-100">
                          <span className="text-gray-500 font-medium block">{k}</span>
                          <span className="text-gray-900 font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Box */}
              <div className="pt-6 border-t border-forest-100 space-y-4">
                {feedback && (
                  <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    justAdded ? 'bg-forest-50 text-forest-800 border border-forest-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {justAdded ? <Check className="w-4 h-4 text-forest-700" /> : <AlertCircle className="w-4 h-4 text-amber-700" />}
                    {feedback}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-forest-200 rounded-xl bg-cream-50 p-1 w-full sm:w-auto justify-between">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:bg-forest-100 disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock || isOutOfStock}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:bg-forest-100 disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 w-full py-4 px-6 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : justAdded
                        ? 'bg-forest-600 text-white'
                        : 'bg-forest-800 hover:bg-forest-900 text-white'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-5 h-5 text-gold-400" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 text-gold-400" /> Add to Cart • {formatNaira(activePrice * quantity)}
                      </>
                    )}
                  </button>

                  <Link
                    href="/dashboard/cart"
                    className="py-4 px-6 rounded-xl border border-forest-300 text-forest-900 hover:bg-forest-50 font-semibold text-sm transition"
                  >
                    Checkout
                  </Link>
                </div>

                {/* Delivery Highlights */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-forest-50/70 border border-forest-100">
                    <Truck className="w-4 h-4 text-forest-700 shrink-0" />
                    <span>Free Tunga delivery or ₦1,000 regional drop</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-forest-50/70 border border-forest-100">
                    <MapPin className="w-4 h-4 text-forest-700 shrink-0" />
                    <span>Free pickup at farm gate counter</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Related Products from This Category
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

