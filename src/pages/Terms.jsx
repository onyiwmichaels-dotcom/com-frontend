export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

        <h1 className="text-4xl font-bold text-gray-800 mb-6 uppercase tracking-wide">
          Terms & Conditions
        </h1>

        <section className="space-y-4 text-gray-700 leading-relaxed">

          <p>
            By accessing or using this platform, you agree to be bound by the following
            Terms and Conditions. If you do not agree, please do not use this service.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-6">
            1. Responsibility of Sellers
          </h2>
          <p>
            Sellers are solely responsible for ensuring that all items listed for sale
            are legally owned and lawfully obtained. The platform does <strong>not verify</strong>
            ownership of listed items.
          </p>
          <p className="font-semibold text-red-700">
            The sale of stolen, illegal, or prohibited items is strictly forbidden.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-6">
            2. Disclaimer of Liability
          </h2>
          <p>
            This platform acts only as a marketplace to connect buyers and sellers.
            We are not responsible for the quality, legality, safety, or authenticity
            of any listed item.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-6">
            3. No Refund Policy
          </h2>
          <p className="font-semibold">
            All sales are final.
          </p>
          <p>
            Once an item has been sold and delivered, <strong>no refunds, returns, or exchanges</strong>
            will be provided under any circumstances.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-6">
            4. User Conduct
          </h2>
          <p>
            Users agree to provide accurate information and to engage in lawful
            transactions only. Any misuse of the platform may result in suspension
            or permanent removal.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-6">
            5. Changes to Terms
          </h2>
          <p>
            We reserve the right to update these Terms and Conditions at any time.
            Continued use of the platform constitutes acceptance of any changes.
          </p>

        </section>
      </div>
    </div>
  );
}
