import { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Shopping Bag — Naag Nool UP',
  description: 'Review the items in your Naag Nool UP shopping bag.',
};

export default function CartPage() {
  return (
    <div className="py-16 sm:py-24 bg-[#F9F6F0] min-h-[65vh]">
      <Container size="narrow">
        <div className="rounded-3xl bg-white border border-[#E5DFC0] p-8 sm:p-12 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#B85233]/10 text-[#B85233] mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B85233]">
              Your Bag
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
              Your Shopping Bag is Empty
            </h1>
          </div>

          <p className="font-sans text-sm sm:text-base text-[#6B655B] max-w-md mx-auto leading-relaxed">
            Begin your transformational journey by exploring our collection of six guided journals and intentional tools.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <Button variant="primary" size="lg" className="shadow-md">
                <span>Browse All Journals</span>
                <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Our Philosophy
              </Button>
            </Link>
          </div>

          <div className="pt-8 border-t border-[#E5DFC0]/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#6B655B] max-w-md mx-auto text-start">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4D5844] shrink-0" />
              <span>Secure checkout enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B85233] shrink-0" />
              <span>Premium linen craft</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
