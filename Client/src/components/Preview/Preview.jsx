import { useState, useEffect } from "react";
import axios from "axios";
import { useLikes } from "../context/like/Like";

const ImageCarousel = ({ images, currentImage, onPrev, onNext, serverUrl, adId }) => {
  const { likedAds, toggleLike } = useLikes();

  const imageUrl = images[currentImage]
    ? `${serverUrl}/${images[currentImage].replace(/\\/g, "/")}`
    : "https://via.placeholder.com/800x500?text=No+Image";

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/800x500?text=No+Image";
  };

  return (
    <div className="relative mb-6 rounded-lg overflow-hidden w-full">
      <div className="relative w-full aspect-[16/10]">
        <img
          src={imageUrl}
          alt="Car Preview"
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          onError={handleImageError}
          loading="lazy"
        />
        <button
          onClick={onPrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 sm:p-2 rounded-full hover:bg-gray-700 disabled:opacity-50"
          disabled={images.length <= 1}
        >
          ←
        </button>
        <button
          onClick={onNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 sm:p-2 rounded-full hover:bg-gray-700 disabled:opacity-50"
          disabled={images.length <= 1}
        >
          →
        </button>
        <div className="absolute top-2 right-2 flex gap-1 sm:gap-2">
          <button className="text-white hover:text-gray-300">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.684 13.342C9.375 12.667 10.257 12.25 11.25 12.25H12.75C13.743 12.25 14.625 12.667 15.316 13.342M8.684 13.342C7.667 14.333 7 15.708 7 17.25C7 19.873 9.127 22 11.75 22C14.373 22 16.5 19.873 16.5 17.25C16.5 15.708 15.833 14.333 14.816 13.342M8.684 13.342L5.25 9.75M14.816 13.342L18.25 9.75M5.25 9.75C5.25 11.959 3.459 13.75 1.25 13.75C3.459 13.75 5.25 15.541 5.25 17.75C5.25 15.541 7.041 13.75 9.25 13.75C7.041 13.75 5.25 11.959 5.25 9.75ZM18.25 9.75C18.25 11.959 20.041 13.75 22.25 13.75C20.041 13.75 18.25 15.541 18.25 17.75C18.25 15.541 16.459 13.75 14.25 13.75C16.459 13.75 18.25 11.959 18.25 9.75Z"
              />
            </svg>
          </button>
          <button
            onClick={() => toggleLike(adId)}
            className="text-white hover:text-gray-300"
            aria-label={likedAds[adId] ? "Unlike ad" : "Like ad"}
          >
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 ${likedAds[adId] ? 'text-red-400' : 'text-white'}`}
              fill={likedAds[adId] ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-2 right-2 text-white text-base sm:text-lg font-bold opacity-50">
          olx
        </div>
      </div>
    </div>
  );
};

const CarDetails = ({ ad }) => {
  const formatLocation = (location) => {
    if (!location) return "Unknown Location";
    const { city, district, state } = location;
    return [city, district, state].filter(Boolean).join(", ");
  };

  const getPostedTime = (postedDate) => {
    const currentDate = new Date("2025-05-15T11:53:00+05:30");
    const posted = new Date(postedDate);
    const diffMs = currentDate - posted;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
          Verified Seller
        </span>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold mb-2">{ad.title || "Unknown Title"}</h1>
      <p className="text-base sm:text-lg text-gray-600 mb-4">{ad.brand || "Unknown Brand"}</p>
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm sm:text-base">{ad.fuel || "N/A"}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-sm sm:text-base">{ad.km_driven ? `${ad.km_driven} KM` : "N/A"}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm sm:text-base">{ad.transmission || "N/A"}</span>
        </div>
      </div>
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-sm sm:text-base">Owner: {ad.owners}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          <span className="text-sm sm:text-base">{formatLocation(ad.location)}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm sm:text-base">Posted: {getPostedTime(ad.posted)}</span>
        </div>
      </div>
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Description</h2>
      <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line">
        {ad.description || "No description available."}
      </p>
    </div>
  );
};

const SellerInfo = ({ ad }) => {
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [isValidOffer, setIsValidOffer] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const originalPrice = parseInt(ad.price) || 0;
  const minOffer = originalPrice * 0.9;
  const maxOffer = originalPrice;

  const handleOfferChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setOfferAmount(value);
    const numericValue = parseInt(value) || 0;

    if (numericValue < minOffer) {
      setErrorMessage(`Offer must be at least ₹${minOffer.toLocaleString()}`);
      setIsValidOffer(false);
    } else if (numericValue > maxOffer) {
      setErrorMessage(`Offer cannot exceed ₹${maxOffer.toLocaleString()}`);
      setIsValidOffer(false);
    } else {
      setErrorMessage('');
      setIsValidOffer(true);
    }
  };

  const handleSubmitOffer = async () => {

    const email = localStorage.getItem("email")

    const response = await axios.post("http://localhost:3000/api/offer", {
      params: {

        sellerMail: ad.email,
        buyerMail: email,
        brand: ad.brand,
        name: ad.name,
        price: ad.price,
        offer: offerAmount,
        state: ad.location.state,
        district: ad.location.district,
        city: ad.location.city
      }
    })
    console.log(response)

    if (isValidOffer) {
      setSuccessMessage('Successfully submitted offer!');
      setOfferAmount('');
      setIsValidOffer(false);
      setTimeout(() => {
        setIsOfferOpen(false);
        setSuccessMessage('');
      }, 2000);
    }
  };

  return (
    <div className="w-full md:w-72 lg:w-80">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          ₹ {originalPrice.toLocaleString()}
        </h2>
        <button
          onClick={() => setIsOfferOpen(true)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4 text-sm sm:text-base cursor-pointer"
        >
          Make Offer
        </button>
        <div className="flex items-center mb-4">
          <img
            src={ad.profilePicture}
            alt="Seller"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2"
          />
          <div>
            <p className="font-semibold text-sm sm:text-base cursor-pointer">{ad.email.split("@")[0]}</p>
            <p className="text-xs sm:text-sm text-gray-500">since 2021</p>
          </div>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 100-16 8 8 0 000 16z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">item listed: 1</p>
        <button className="w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 mb-4 text-sm sm:text-base cursor-pointer">
          Chat with Seller
        </button>
        <div className="flex items-center">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span className="text-sm sm:text-base text-blue-800 cursor-pointer">+91 98469 24588</span>
        </div>
      </div>

      {/* Offer Popup */}
      {isOfferOpen && (
        <div className="absolute inset-0 bg-transparent bg-opacity-50 flex items-start justify-center pt-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Make an Offer</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter an offer between ₹{minOffer.toLocaleString()} and ₹{maxOffer.toLocaleString()}
            </p>
            <input
              type="text"
              value={offerAmount}
              onChange={handleOfferChange}
              placeholder="Enter amount"
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm mb-4">{successMessage}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsOfferOpen(false);
                  setOfferAmount('');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitOffer}
                className={`px-4 py-2 rounded text-white ${isValidOffer ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                disabled={!isValidOffer}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Preview = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const server_url = "http://localhost:3000";

  const fetchAd = async () => {
    try {
      const adId = localStorage.getItem("selectedAdId");
      if (!adId) {
        throw new Error("No ad ID found in localStorage");
      }

      setLoading(true);
      setError("");

      const response = await axios.get(`${server_url}/api/loadpreview/${adId}`);
      console.log("Fetched ad:", response.data);
      setAd(response.data);
    } catch (err) {
      console.error("Error fetching ad:", err);
      setError("Failed to load ad details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAd();
  }, []);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? (ad?.postImage?.length || 1) - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === (ad?.postImage?.length || 1) - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ad not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <ImageCarousel
          images={ad.postImage || []}
          currentImage={currentImage}
          onPrev={handlePrev}
          onNext={handleNext}
          serverUrl={server_url}
          adId={ad._id}
        />
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          <CarDetails ad={ad} />
          <SellerInfo ad={ad} />
        </div>
      </div>
    </div>
  );
};

export default Preview;



































// import { useState, useEffect } from "react";
//     import axios from "axios";
//     import { useLikes } from "../context/like/Like";

//     const ImageCarousel = ({ images, currentImage, onPrev, onNext, serverUrl, adId }) => {
//       const { likedAds, toggleLike } = useLikes();

//       const imageUrl = images[currentImage]
//         ? `${serverUrl}/${images[currentImage].replace(/\\/g, "/")}`
//         : "https://via.placeholder.com/800x500?text=No+Image";

//       const handleImageError = (e) => {
//         e.target.src = "https://via.placeholder.com/800x500?text=No+Image";
//       };

//       return (
//         <div className="relative mb-6 rounded-lg overflow-hidden w-full">
//           <div className="relative w-full aspect-[16/10]">
//             <img
//               src={imageUrl}
//               alt="Car Preview"
//               className="absolute inset-0 w-full h-full object-cover rounded-lg"
//               onError={handleImageError}
//               loading="lazy"
//             />
//             <button
//               onClick={onPrev}
//               className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 sm:p-2 rounded-full hover:bg-gray-700 disabled:opacity-50"
//               disabled={images.length <= 1}
//             >
//               ←
//             </button>
//             <button
//               onClick={onNext}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 sm:p-2 rounded-full hover:bg-gray-700 disabled:opacity-50"
//               disabled={images.length <= 1}
//             >
//               →
//             </button>
//             <div className="absolute top-2 right-2 flex gap-1 sm:gap-2">
//               <button className="text-white hover:text-gray-300">
//                 <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M8.684 13.342C9.375 12.667 10.257 12.25 11.25 12.25H12.75C13.743 12.25 14.625 12.667 15.316 13.342M8.684 13.342C7.667 14.333 7 15.708 7 17.25C7 19.873 9.127 22 11.75 22C14.373 22 16.5 19.873 16.5 17.25C16.5 15.708 15.833 14.333 14.816 13.342M8.684 13.342L5.25 9.75M14.816 13.342L18.25 9.75M5.25 9.75C5.25 11.959 3.459 13.75 1.25 13.75C3.459 13.75 5.25 15.541 5.25 17.75C5.25 15.541 7.041 13.75 9.25 13.75C7.041 13.75 5.25 11.959 5.25 9.75ZM18.25 9.75C18.25 11.959 20.041 13.75 22.25 13.75C20.041 13.75 18.25 15.541 18.25 17.75C18.25 15.541 16.459 13.75 14.25 предпочитаю 13.75C16.459 13.75 18.25 11.959 18.25 9.75Z"
//                   />
//                 </svg>
//               </button>
//               <button
//                 onClick={() => toggleLike(adId)}
//                 className="text-white hover:text-gray-300"
//                 aria-label={likedAds[adId] ? "Unlike ad" : "Like ad"}
//               >
//                 <svg
//                   className={`w-5 h-5 sm:w-6 sm:h-6 ${likedAds[adId] ? 'text-red-400' : 'text-white'}`}
//                   fill={likedAds[adId] ? 'currentColor' : 'none'}
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="absolute bottom-2 right-2 text-white text-base sm:text-lg font-bold opacity-50">
//               olx
//             </div>
//           </div>
//         </div>
//       );
//     };

//     const CarDetails = ({ ad }) => {
//       const formatLocation = (location) => {
//         if (!location) return "Unknown Location";
//         const { city, district, state } = location;
//         return [city, district, state].filter(Boolean).join(", ");
//       };

//       const getPostedTime = (postedDate) => {
//         const currentDate = new Date("2025-05-15T11:53:00+05:30");
//         const posted = new Date(postedDate);
//         const diffMs = currentDate - posted;
//         const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//         const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

//         if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
//         if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
//         if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
//         return "Just now";
//       };

//       return (
//         <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow">
//           <div className="flex items-center mb-4">
//             <svg
//               className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//               />
//             </svg>
//             <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
//               Verified Seller
//             </span>
//           </div>
//           <h1 className="text-xl sm:text-2xl font-bold mb-2">{ad.title || "Unknown Title"}</h1>
//           <p className="text-base sm:text-lg text-gray-600 mb-4">{ad.brand || "Unknown Brand"}</p>
//           <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
//             <div className="flex items-center">
//               <svg
//                 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <span className="text-sm sm:text-base">{ad.fuel || "N/A"}</span>
//             </div>
//             <div className="flex items-center">
//               <svg
//                 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M13 10V3L4 14h7v7l9-11h-7z"
//                 />
//               </svg>
//               <span className="text-sm sm:text-base">{ad.km_driven ? `${ad.km_driven} KM` : "N/A"}</span>
//             </div>
//             <div className="flex items-center">
//               <svg
//                 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//               <span className="text-sm sm:text-base">{ad.transmission || "N/A"}</span>
//             </div>
//           </div>
//           <h2 className="text-lg sm:text-xl font-semibold mb-2">Overview</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
//             <div className="flex items-center">
//               <svg
//                 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                 />
//               </svg>
//               <span className="text-sm sm:text-base">Owner: {ad.owners}</span>
//             </div>
//             <div className="flex items-center">
//               <svg
//                 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                 />
//               </svg>
//               <span className="text-sm sm:text-base">{formatLocation(ad.location)}</span>
//             </div>
//             <div className="flex items-center">
//               <svg
//                 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//               <span className="text-sm sm:text-base">Posted: {getPostedTime(ad.posted)}</span>
//             </div>
//           </div>
//           <h2 className="text-lg sm:text-xl font-semibold mb-2">Description</h2>
//           <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line">
//             {ad.description || "No description available."}
//           </p>
//         </div>
//       );
//     };

//     const SellerInfo = ({ ad }) => {
//       return (
//         <div className="w-full md:w-72 lg:w-80">
//           <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
//             <h2 className="text-xl sm:text-2xl font-bold mb-4">
//               ₹ {(parseInt(ad.price) || 0).toLocaleString()}
//             </h2>
//             <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4 text-sm sm:text-base cursor-pointer">
//               Make Offer
//             </button>
//             <div className="flex items-center mb-4">
//               <img
//                 src={ad.profilePicture}
//                 alt="Seller"
//                 className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2"
//               />
//               <div>
//                 <p className="font-semibold text-sm sm:text-base cursor-pointer">{ad.email.split("@")[0]}</p>
//                 <p className="text-xs sm:text-sm text-gray-500">since 2021</p>
//               </div>
//               <svg
//                 className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-yellow-500"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                 <path
//                   fillRule="evenodd"
//                   d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 100-16 8 8 0 000 16z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <p className="text-xs sm:text-sm text-gray-500 mb-4">item listed: 1</p>
//             <button className="w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 mb-4 text-sm sm:text-base cursor-pointer">
//               Chat with Seller
//             </button>
//             <div className="flex items-center">
//               <svg
//                 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                 />
//               </svg>
//               <span className="text-sm sm:text-base text-blue-800 cursor-pointer">+91 98469 24588</span>
//             </div>
//           </div>
//         </div>
//       );
//     };

//     const Preview = () => {
//       const [currentImage, setCurrentImage] = useState(0);
//       const [ad, setAd] = useState(null);
//       const [loading, setLoading] = useState(true);
//       const [error, setError] = useState("");
//       const server_url = "http://localhost:3000";

//       const fetchAd = async () => {
//         try {
//           const adId = localStorage.getItem("selectedAdId");
//           if (!adId) {
//             throw new Error("No ad ID found in localStorage");
//           }

//           setLoading(true);
//           setError("");

//           const response = await axios.get(`${server_url}/api/loadpreview/${adId}`);
//           console.log("Fetched ad:", response.data);
//           setAd(response.data);
//         } catch (err) {
//           console.error("Error fetching ad:", err);
//           setError("Failed to load ad details. Please try again.");
//         } finally {
//           setLoading(false);
//         }
//       };

//       useEffect(() => {
//         fetchAd();
//       }, []);

//       const handlePrev = () => {
//         setCurrentImage((prev) => (prev === 0 ? (ad?.postImage?.length || 1) - 1 : prev - 1));
//       };

//       const handleNext = () => {
//         setCurrentImage((prev) => (prev === (ad?.postImage?.length || 1) - 1 ? 0 : prev + 1));
//       };

//       if (loading) {
//         return (
//           <div className="min-h-screen flex items-center justify-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
//           </div>
//         );
//       }

//       if (error) {
//         return (
//           <div className="min-h-screen flex items-center justify-center text-red-600">
//             {error}
//           </div>
//         );
//       }

//       if (!ad) {
//         return (
//           <div className="min-h-screen flex items-center justify-center">
//             Ad not found.
//           </div>
//         );
//       }

//       return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//           <div className="max-w-6xl mx-auto">
//             <ImageCarousel
//               images={ad.postImage || []}
//               currentImage={currentImage}
//               onPrev={handlePrev}
//               onNext={handleNext}
//               serverUrl={server_url}
//               adId={ad._id}
//             />
//             <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
//               <CarDetails ad={ad} />
//               <SellerInfo ad={ad} />
//             </div>
//           </div>
//         </div>
//       );
//     };

//     export default Preview;
