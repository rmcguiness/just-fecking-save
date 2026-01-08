import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto pt-16">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="border-t border-gray-200 mb-6"></div>
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">
              Terms
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/faq" className="hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

