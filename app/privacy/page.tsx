import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-white p-8">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {/* Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mb-8"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back</span>
          </Link>

          {/* Title */}
          <h1 className="text-4xl font-bold text-black mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-12">Last updated: January 2025</p>

          {/* Content Sections */}
          <div className="space-y-8 text-gray-800">
            {/* The Short Version */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">The Short Version</h2>
              <p className="leading-relaxed">
                <strong>We don&apos;t store your financial data.</strong> Your statements are analyzed
                and immediately discarded. Results are stored only in your browser&apos;s{' '}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                  localStorage
                </code>
                , not on our servers.
              </p>
            </section>

            {/* What We Process */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">What We Process</h2>
              <ul className="space-y-3 list-disc list-inside leading-relaxed">
                <li>
                  <strong>CSV Files:</strong> Analyzed by AI to identify subscriptions. Files are
                  processed in memory and never saved to disk or database.
                </li>
                <li>
                  <strong>Payment Info:</strong> Handled entirely by Stripe. We never see your card
                  number.
                </li>
                <li>
                  <strong>Email:</strong> Stored for receipts and support. That&apos;s it.
                </li>
              </ul>
            </section>

            {/* Zero-Storage Architecture */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                Zero-Storage Architecture
              </h2>
              <p className="leading-relaxed mb-4">
                Subscription results are sent directly to your browser and stored in{' '}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                  localStorage
                </code>
                . This means:
              </p>
              <ul className="space-y-2 list-disc list-inside leading-relaxed">
                <li>Your data never touches our database</li>
                <li>Only you can access your results</li>
                <li>Data auto-expires after 48 hours</li>
                <li>Clearing your browser data removes everything</li>
              </ul>
            </section>

            {/* What We Do Store */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">What We Do Store</h2>
              <ul className="space-y-3 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Payment Records:</strong> Stripe transaction IDs for refund processing
                  (no financial details)
                </li>
                <li>
                  <strong>Rate Limits:</strong> Hashed IP addresses to prevent abuse (not
                  reversible to actual IPs)
                </li>
              </ul>
            </section>

            {/* Third Parties */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Third Parties</h2>
              <ul className="space-y-3 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Stripe:</strong> Payment processing (
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-600"
                  >
                    their privacy policy
                  </a>
                  )
                </li>
                <li>
                  <strong>Anthropic Claude:</strong> AI analysis of your transactions (processed,
                  not stored)
                </li>
                <li>
                  <strong>Vercel:</strong> Website hosting
                </li>
              </ul>
            </section>

            {/* No Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">No Tracking</h2>
              <p className="leading-relaxed">
                We don&apos;t use cookies for tracking. No Google Analytics. No Facebook Pixel. No
                retargeting. Vercel Analytics may be used for basic page view counts (no personal
                data).
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Contact</h2>
              <p className="leading-relaxed">
                Questions? Email{' '}
                <a
                  href="mailto:hello@justcancel.io"
                  className="text-blue-500 underline hover:text-blue-600"
                >
                  hello@justcancel.io
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

