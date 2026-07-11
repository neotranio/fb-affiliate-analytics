import { getProducts } from '@/lib/data';
import { ProductExplorer } from './product-explorer';

export default function ProductsPage() {
  const products = getProducts();
  return <ProductExplorer products={products} />;
}
