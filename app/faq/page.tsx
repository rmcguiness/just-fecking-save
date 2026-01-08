import Link from 'next/link';
import Footer from '@/components/Footer';

export default function FAQPage() {
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
          <h1 className="text-4xl font-bold text-black mb-2">FAQ</h1>
          <p className="text-gray-600 mb-12">Common questions about Just Cancel</p>

          {/* Content Sections */}
          <div className="space-y-12 text-gray-800">
            {/* PRIVACY & SECURITY */}
            <section>
              <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">
                PRIVACY & SECURITY
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-black mb-2">
                    Do you store my financial data?
                  </h3>
                  <p className="leading-relaxed text-gray-800">
                    No. We do not have a database for user transactions. The analysis results live
                    in your browser&apos;s localStorage and auto-delete after 48 hours.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">Who can see my transactions?</h3>
                  <p className="leading-relaxed text-gray-800">
                    Results exist only in your browser&apos;s local storage.
                  </p>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-300"></div>

            {/* PRICING & REFUNDS */}
            <section>
              <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">
                PRICING & REFUNDS
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-black mb-2">What do I get for $5?</h3>
                  <p className="leading-relaxed text-gray-800">
                    A list of every subscription we are able to identify, direct cancellation links
                    for each, calculated cost totals. All for a one-time payment.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">
                    What if I don&apos;t save more than $5?
                  </h3>
                  <p className="leading-relaxed text-gray-800">
                    If Just Cancel does not pay for itself, you shouldn&apos;t pay for it. If you can&apos;t
                    find more than $5 in yearly savings, please send us an email at{' '}
                    <a
                      href="mailto:hello@justcancel.io"
                      className="text-blue-500 underline hover:text-blue-600"
                    >
                      hello@justcancel.io
                    </a>{' '}
                    for a refund.
                  </p>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-300"></div>

            {/* HOW IT WORKS */}
            <section>
              <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">
                HOW IT WORKS
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-black mb-2">
                    Do you cancel subscriptions for me?
                  </h3>
                  <p className="leading-relaxed text-gray-800">
                    We find them; you cancel them. We give you a complete list of all your
                    subscriptions with direct links to each service&apos;s cancel page — one click away.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">
                    How much transaction history do I need?
                  </h3>
                  <p className="leading-relaxed text-gray-800">
                    Just your 2-3 most recent months of transaction history. Do not upload more
                    than 3 months, it won&apos;t improve the quality of the results.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">
                    What banks/formats do you support?
                  </h3>
                  <p className="leading-relaxed text-gray-800">
                    CSV exports from most banks - Chase, Capital One, Amex, Citi, Discover, Wells
                    Fargo, and international formats (Revolut, N26, HDFC, Nubank). PDF statements
                    are also supported for Bank of America and other major banks.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">Is there a free version?</h3>
                  <p className="leading-relaxed text-gray-800">
                    Yes - the{' '}
                    <a
                      href="#"
                      className="text-blue-500 underline hover:text-blue-600"
                    >
                      open source version
                    </a>{' '}
                    is free, but requires terminal setup and your own API key.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

