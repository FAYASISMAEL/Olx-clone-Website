import playstore from "../../assets/playstore.png";
import appstore from "../../assets/app.png";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-27 px-10 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">CarTrade Tech</span>
          <span className="text-sm uppercase">Group</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          <a href="#" className="text-white hover:underline text-sm sm:text-base">OLX</a>
          <a href="#" className="text-white hover:underline text-sm sm:text-base">carwale</a>
          <a href="#" className="text-white hover:underline text-sm sm:text-base">bikewale</a>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm sm:text-base">CarTrade</span>
          <span className="text-sm sm:text-base">Mobility Outlook</span>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-2">
          {/* <div className="flex gap-3">
            <a href="#">
              <img src={playstore} alt="Google Play" className="h-8" />
            </a>
            <a href="#">
              <img src={appstore} alt="App Store" className="h-8" />
            </a>
          </div> */}
          <div className="text-center sm:text-right text-sm">
            <a href="#" className="hover:underline">Help - Sitemap</a>
            <p>ALL RIGHTS RESERVED © 2006-2025 OLX</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;