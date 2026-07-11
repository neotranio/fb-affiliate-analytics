import { getOffers } from '@/lib/data';
import { OffersExplorer } from './offers-explorer';

export default function OffersPage() {
  const offers = getOffers();
  return <OffersExplorer offers={offers} />;
}
