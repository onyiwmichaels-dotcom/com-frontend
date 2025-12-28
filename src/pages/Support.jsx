export default function Support() {
  return (
    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Support & Help
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 border">
        <p className="text-lg text-gray-700 mb-4">
          Need help? We’re here for you!
        </p>

        <div className="space-y-4">

          {/* PHONE SUPPORT */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">📞 Phone Support</h2>
            <p className="text-gray-700 mt-1">
              Call us anytime:
              <span className="font-bold text-blue-700 ml-1">0737 107 602</span>
            </p>
          </div>

          {/* INSTAGRAM SUPPORT */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">📸 Instagram Support</h2>
            <p className="text-gray-700 mt-1">
              DM us on Instagram:
              <span className="font-bold text-blue-700 ml-1">@COM-KE</span>
            </p>
          </div>

          {/* ABOUT US */}
          <div className="pt-5 border-t">
            <h2 className="text-xl font-semibold text-gray-800">About Us</h2>
            <p className="text-gray-700 mt-2 leading-relaxed">
              <span className="font-bold">COM</span> — Your trusted online seller/buyer.  
              We connect buyers and sellers safely, reliably, and quickly.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
