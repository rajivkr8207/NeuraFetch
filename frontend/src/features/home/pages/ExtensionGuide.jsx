import { Download, Wrench, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { FaFileZipper } from "react-icons/fa6";
const ExtensionGuide = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-400">
            Get NeuraFetch Extension
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Extract, save and analyze website content seamlessly with our powerful browser extension. Follow the guide below to get started.
          </p>

          <div className="pt-4">
            <a
              href="/NeuraFetch_Extension.zip"
              download="NeuraFetch_Extension.zip"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 rounded-xl shadow-lg hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <Download className="w-6 h-6" />
              Download Extension ZIP
            </a>
            <p className="text-sm text-gray-500 mt-4">Requires Google Chrome or Edge</p>
          </div>
        </div>

        {/* Installation Steps */}
        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Wrench className="text-orange-400" />
            Installation Guide
          </h2>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-600 before:to-transparent">

            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-900 bg-orange-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow bg-gray-800/80 border border-gray-700 ml-4 md:ml-0 hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <FaFileZipper className="w-5 h-5 text-orange-400" />
                  <h3 className="font-bold text-white text-lg">Extract the ZIP</h3>
                </div>
                <p className="text-gray-400">
                  After downloading the extension, locate the `NeuraFetch_Extension.zip` file on your computer and extract (unzip) its contents into a folder. You can place this folder anywhere on your computer (e.g., Documents).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-900 bg-orange-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow bg-gray-800/80 border border-gray-700 ml-4 md:ml-0 hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-5 h-5 text-orange-400" />
                  <h3 className="font-bold text-white text-lg">Open Extensions Page</h3>
                </div>
                <p className="text-gray-400">
                  Open your Google Chrome browser. Type <code className="bg-gray-900 px-2 py-1 rounded text-orange-300 font-mono text-sm">chrome://extensions/</code> in the address bar and press Enter.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-900 bg-orange-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow bg-gray-800/80 border border-gray-700 ml-4 md:ml-0 hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-orange-400" />
                  <h3 className="font-bold text-white text-lg">Enable Developer Mode</h3>
                </div>
                <p className="text-gray-400">
                  In the top-right corner of the Extensions page, you will find a toggle switch labeled <strong>"Developer mode"</strong>. Make sure this toggle is turned <strong>ON</strong>.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-900 bg-orange-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow bg-gray-800/80 border border-gray-700 ml-4 md:ml-0 hover:border-orange-500/50 transition-colors bg-gradient-to-br from-gray-800/80 to-orange-900/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <h3 className="font-bold text-white text-lg">Load Unpacked</h3>
                </div>
                <p className="text-gray-400">
                  Click the <strong>"Load unpacked"</strong> button that appeared in the top-left corner. Select the folder where you extracted the extension in Step 1. The extension will now be installed and ready to use!
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-8 pb-12">
          <a href="/" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors">
            Go back to Dashboard <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default ExtensionGuide;
