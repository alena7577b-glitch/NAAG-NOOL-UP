import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function AdminUnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#F9F6F0]">
      <Container size="narrow" className="w-full max-w-md text-center">
        <div className="bg-white border border-[#E5DFC0] rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A] mb-3">
            Access Restricted
          </h1>
          <p className="text-sm text-[#1E1C1A]/70 leading-relaxed mb-8">
            You do not have administrative permissions to view or manage the administration portal.
          </p>
          <div className="space-y-3">
            <Link href="/account" className="block w-full">
              <Button variant="primary" size="md" className="w-full justify-center">
                Return to My Account
              </Button>
            </Link>
            <Link href="/" className="block w-full">
              <Button variant="outline" size="md" className="w-full justify-center">
                <ArrowLeft className="w-4 h-4 me-2" />
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
