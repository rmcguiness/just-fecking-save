import Link from 'next/link';
import Footer from '@/components/Footer';

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-black mb-2">Terms of Service</h1>
          <p className="text-gray-600 mb-12">Last updated: January 2025</p>

          {/* Content Sections */}
          <div className="space-y-8 text-gray-800">
            {/* What This Service Does */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">What This Service Does</h2>
              <p className="leading-relaxed">
                Just Cancel analyzes your CSV files to identify recurring subscriptions and provides
                links to help you cancel them. We use AI to detect subscription patterns and match
                them to known services.
              </p>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Payment</h2>
              <ul className="space-y-3 list-disc list-inside leading-relaxed">
                <li>
                  The service costs <strong>$5 USD</strong> (one-time payment)
                </li>
                <li>Payment is processed securely by Stripe</li>
                <li>You get immediate access to your full subscription report after payment</li>
              </ul>
            </section>

            {/* Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Refunds</h2>
              <p className="leading-relaxed">
                If the service doesn't work for you (e.g., we couldn't identify any subscriptions
                from your CSV), email{' '}
                <a
                  href="mailto:hello@justcancel.io"
                  className="text-blue-500 underline hover:text-blue-600"
                >
                  hello@justcancel.io
                </a>{' '}
                within 7 days for a full refund. No questions asked.
              </p>
            </section>

            {/* What We Don't Guarantee */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">What We Don't Guarantee</h2>
              <ul className="space-y-3 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Accuracy:</strong> AI analysis may miss subscriptions or misidentify
                  transactions. Always verify against your actual statements.
                </li>
                <li>
                  <strong>Cancel Links:</strong> We provide links to cancellation pages, but we
                  can't guarantee they'll work or that services haven't changed their process.
                </li>
                <li>
                  <strong>Savings:</strong> We show what you're spending, not what you'll save.
                  Actual savings depend on what you choose to cancel.
                </li>
              </ul>
            </section>

            {/* Your Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Your Responsibilities</h2>
              <ul className="space-y-3 list-disc list-inside leading-relaxed">
                <li>Upload only your own statements</li>
                <li>Verify subscription information before taking action</li>
                <li>Don't abuse the service (rate limits apply)</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Limitation of Liability</h2>
              <p className="leading-relaxed">
                Just Cancel is provided 'as is' without warranties. We're not responsible for any
                actions you take based on our analysis, including canceling services you didn't mean
                to cancel. Our liability is limited to the amount you paid for the service ($5).
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Changes to Terms</h2>
              <p className="leading-relaxed">
                We may update these terms. Continued use after changes means you accept the new
                terms.
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

