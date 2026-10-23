import { Metadata } from 'next';
import { AyeyoKorisView } from '@/components/ayeyo-koris/AyeyoKorisView';

export const metadata: Metadata = {
  title: 'Ayeeyo Koris Children — Educational Scholarship',
  description:
    'Ayeeyo Koris Children is an educational scholarship initiative dedicated to children raised by their grandmothers. Honoring Somali families through love, care, education, and opportunity.',
  openGraph: {
    title: 'Ayeeyo Koris Children — Grandmothers Raise Tomorrow',
    description:
      'Care Today. Opportunity Tomorrow. Supporting grandmothers and children to build confident, capable, and hopeful futures.',
    images: ['/images/ayeeyo-hero-family.jpg'],
  },
};

export default function AyeyoKorisPage() {
  return <AyeyoKorisView />;
}
