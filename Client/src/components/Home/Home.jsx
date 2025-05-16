import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useSearch } from '../context/search/Search';

const Home = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(8);

  const server_url = 'http://localhost:3000';
  const email = localStorage.getItem('email');

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const cachedAds = localStorage.getItem('carAds');
      if (cachedAds) {
        setAds(JSON.parse(cachedAds));
      }

      const response = await axios.get(`${server_url}/api/load`);
      console.log('Fetched ads:', response.data.ads);
      setAds(response.data.ads);
      localStorage.setItem('carAds', JSON.stringify(response.data.ads));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load ads. Showing sample data instead.');
      // setAds(dummyAds);
      localStorage.setItem('carAds', JSON.stringify(dummyAds));
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAds(ads);
    } else {
      const filtered = ads.filter((ad) =>
        ad.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAds(filtered);
    }
    setCurrentPage(1);
  }, [ads, searchQuery]);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/160x120?text=No+Image';
  };

  const getPostedTime = (posted) => {
    if (!posted) return 'Just now';

    const currentTime = new Date('2025-05-15T10:59:00.000Z');
    const postedTime = new Date(posted);
    const diffMs = currentTime - postedTime;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

    return postedTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  const handleAdClick = (adId) => {
    localStorage.setItem('selectedAdId', adId);
    navigate('/preview');
  };

  async function likeAd(adId) {
    if (!email) {
      setError('Please log in to like ads.');
      return;
    }

    const prevAds = [...ads];
    const prevFilteredAds = [...filteredAds];

    setAds((prevAds) =>
      prevAds.map((ad) => {
        if (ad._id === adId) {
          const currentLikes = Array.isArray(ad.like) ? ad.like : [];
          const isLiked = currentLikes.includes(email);
          const newLikes = isLiked
            ? currentLikes.filter((e) => e !== email)
            : [...currentLikes, email];
          return { ...ad, like: newLikes };
        }
        return ad;
      })
    );

    setFilteredAds((prevFiltered) =>
      prevFiltered.map((ad) => {
        if (ad._id === adId) {
          const currentLikes = Array.isArray(ad.like) ? ad.like : [];
          const isLiked = currentLikes.includes(email);
          const newLikes = isLiked
            ? currentLikes.filter((e) => e !== email)
            : [...currentLikes, email];
          return { ...ad, like: newLikes };
        }
        return ad;
      })
    );

    try {
      const response = await axios.post(`${server_url}/api/like/${adId}`, { email });
      console.log('Like response:', response.data);

      const updatedAds = ads.map((ad) => {
        if (ad._id === adId) {
          const currentLikes = Array.isArray(ad.like) ? ad.like : [];
          const newLikes = response.data.liked
            ? [...currentLikes, email]
            : currentLikes.filter((e) => e !== email);
          return { ...ad, like: newLikes };
        }
        return ad;
      });
      localStorage.setItem('carAds', JSON.stringify(updatedAds));
    } catch (error) {
      console.error('Error liking ad:', error);
      setError('Failed to update like status: ' + error.message);

      setAds(prevAds);
      setFilteredAds(prevFilteredAds);
    }
  }

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);
  const totalPages = Math.ceil(filteredAds.length / adsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfWindow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);


    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`mx-1 px-3 py-1 rounded-full text-sm font-medium ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-156 bg-white font-sans">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading && !ads.length && (
          <p className="text-center text-gray-600">Loading ads...</p>
        )}
        {error && (
          <p className="text-center text-red-600 mb-4">{error}</p>
        )}
        {!loading && filteredAds.length === 0 && (
          <p className="text-center text-gray-600">No ads match your search.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {currentAds.map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-300"
              onClick={() => handleAdClick(ad._id)}
            >
              <div className="relative">
                <img
                  src={ad.postImage && ad.postImage[0] ? `${server_url}/${ad.postImage[0]}` : 'https://via.placeholder.com/160x120?text=No+Image'}
                  alt={ad.name || 'Car Ad'}
                  className="h-48 w-full object-cover object-center rounded mt-2 mb-2 mx-2"
                  onError={handleImageError}
                />
                {ad.featured && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold text-gray-900 mx-2 px-2 py-1 uppercase">
                    Featured
                  </span>
                )}
                <button
                  className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100 mx-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    likeAd(ad._id);
                  }}
                  aria-label={ad.like?.includes(email) ? "Unlike ad" : "Like ad"}
                >
                  <svg
                    className={`w-5 h-5 ${ad.like?.includes(email) ? 'text-red-400' : 'text-gray-600'}`}
                    fill={ad.like?.includes(email) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
              <div className="p-4">
                <p className="text-lg font-semibold text-gray-900">₹ {ad.price.toLocaleString()}</p>
                <p className="text-sm text-gray-700 font-medium truncate">{ad.name}</p>
                <p className="text-sm text-gray-500">{ad.brand}</p>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-400 mt-1">{ad.location.city}</p>
                  <p className="text-xs text-gray-400 mt-1">{getPostedTime(ad.posted)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredAds.length > 0 && (
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`mx-1 px-3 py-1 rounded-full text-sm font-medium ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ←
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`mx-1 px-3 py-1 rounded-full text-sm font-medium ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

























// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useSearch } from '../context/search/Search';

// const Home = () => {
//   const { isAuthenticated, isLoading: authLoading } = useAuth0();
//   const { searchQuery } = useSearch();
//   const navigate = useNavigate();

//   const [ads, setAds] = useState([]);
//   const [filteredAds, setFilteredAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const server_url = 'http://localhost:3000';
//   const email = localStorage.getItem('email'); // Get email from localStorage

//   async function loadData() {
//     try {
//       setLoading(true);
//       setError('');

//       const cachedAds = localStorage.getItem('carAds');
//       if (cachedAds) {
//         setAds(JSON.parse(cachedAds));
//       }

//       const response = await axios.get(`${server_url}/api/load`);
//       console.log('Fetched ads:', response.data.ads);
//       setAds(response.data.ads);
//       localStorage.setItem('carAds', JSON.stringify(response.data.ads));
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError('Failed to load ads. Showing sample data instead.');
//       setAds(dummyAds);
//       localStorage.setItem('carAds', JSON.stringify(dummyAds));
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!authLoading) {
//       loadData();
//     }
//   }, [authLoading]);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredAds(ads);
//     } else {
//       const filtered = ads.filter((ad) =>
//         ad.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredAds(filtered);
//     }
//   }, [ads, searchQuery]);

//   const handleImageError = (e) => {
//     e.target.src = 'https://via.placeholder.com/160x120?text=No+Image';
//   };

//   const getPostedTime = (posted) => {
//     if (!posted) return 'Just now';

//     const currentTime = new Date('2025-05-15T10:59:00.000Z'); // 04:29 PM IST (UTC +5:30) = 10:59 UTC
//     const postedTime = new Date(posted);
//     const diffMs = currentTime - postedTime;

//     const diffMins = Math.floor(diffMs / (1000 * 60));
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
//     if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
//     if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

//     return postedTime.toLocaleString('en-US', {
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: true,
//       timeZone: 'Asia/Kolkata',
//     });
//   };

//   const handleAdClick = (adId) => {
//     localStorage.setItem('selectedAdId', adId);
//     navigate('/preview');
//   };

//   async function likeAd(adId) {
//     if (!email) {
//       setError('Please log in to like ads.');
//       return;
//     }

//     // Store the previous state for rollback in case of error
//     const prevAds = [...ads];
//     const prevFilteredAds = [...filteredAds];

//     // Optimistically update the UI
//     setAds((prevAds) =>
//       prevAds.map((ad) => {
//         if (ad._id === adId) {
//           const currentLikes = Array.isArray(ad.like) ? ad.like : [];
//           const isLiked = currentLikes.includes(email);
//           const newLikes = isLiked
//             ? currentLikes.filter((e) => e !== email)
//             : [...currentLikes, email];
//           return { ...ad, like: newLikes };
//         }
//         return ad;
//       })
//     );

//     setFilteredAds((prevFiltered) =>
//       prevFiltered.map((ad) => {
//         if (ad._id === adId) {
//           const currentLikes = Array.isArray(ad.like) ? ad.like : [];
//           const isLiked = currentLikes.includes(email);
//           const newLikes = isLiked
//             ? currentLikes.filter((e) => e !== email)
//             : [...currentLikes, email];
//           return { ...ad, like: newLikes };
//         }
//         return ad;
//       })
//     );

//     try {
//       const response = await axios.post(`${server_url}/api/like/${adId}`, { email });
//       console.log('Like response:', response.data);

//       // Update localStorage with the new ads state
//       const updatedAds = ads.map((ad) => {
//         if (ad._id === adId) {
//           const currentLikes = Array.isArray(ad.like) ? ad.like : [];
//           const newLikes = response.data.liked
//             ? [...currentLikes, email]
//             : currentLikes.filter((e) => e !== email);
//           return { ...ad, like: newLikes };
//         }
//         return ad;
//       });
//       localStorage.setItem('carAds', JSON.stringify(updatedAds));
//     } catch (error) {
//       console.error('Error liking ad:', error);
//       setError('Failed to update like status: ' + error.message);

//       // Revert the optimistic update
//       setAds(prevAds);
//       setFilteredAds(prevFilteredAds);
//     }
//   }

//   return (
//     <div className="min-h-156 bg-white font-sans">
//       <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         {loading && !ads.length && (
//           <p className="text-center text-gray-600">Loading ads...</p>
//         )}
//         {error && (
//           <p className="text-center text-red-600 mb-4">{error}</p>
//         )}
//         {!loading && filteredAds.length === 0 && (
//           <p className="text-center text-gray-600">No ads match your search.</p>
//         )}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
//           {filteredAds.map((ad) => (
//             <div
//               key={ad._id}
//               className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-300"
//               onClick={() => handleAdClick(ad._id)}
//             >
//               <div className="relative">
//                 <img
//                   src={ad.postImage && ad.postImage[0] ? `${server_url}/${ad.postImage[0]}` : 'https://via.placeholder.com/160x120?text=No+Image'}
//                   alt={ad.name || 'Car Ad'}
//                   className="h-48 w-full object-cover object-center rounded mt-2 mb-2 mx-2"
//                   onError={handleImageError}
//                 />
//                 {ad.featured && (
//                   <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold text-gray-900 mx-2 px-2 py-1 uppercase">
//                     Featured
//                   </span>
//                 )}
//                 <button
//                   className="absolute top-2 right-2 bg-White rounded-full p-1.5 shadow-sm hover:bg-gray-100 mx-2 cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     likeAd(ad._id);
//                   }}
//                   aria-label={ad.like?.includes(email) ? "Unlike ad" : "Like ad"}
//                 >
//                   <svg
//                     className={`w-5 h-5 ${ad.like?.includes(email) ? 'text-red-400' : 'text-gray-600'}`}
//                     fill={ad.like?.includes(email) ? 'currentColor' : 'none'}
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <div className="p-4">
//                 <p className="text-lg font-semibold text-gray-900">₹ {ad.price.toLocaleString()}</p>
//                 <p className="text-sm text-gray-700 font-medium truncate">{ad.name}</p>
//                 <p className="text-sm text-gray-500">{ad.brand}</p>
//                 <div className="flex justify-between">
//                   <p className="text-xs text-gray-400 mt-1">{ad.location.city}</p>
//                   <p className="text-xs text-gray-400 mt-1">{getPostedTime(ad.posted)}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;





// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useSearch } from '../context/search/Search';

// const Home = () => {
//   const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
//   const { searchQuery } = useSearch();
//   const navigate = useNavigate();

//   const [ads, setAds] = useState([]);
//   const [filteredAds, setFilteredAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   const dummyAds = [

//   ];
//   const server_url = 'http://localhost:3000';
//   const email = localStorage.getItem('email');

//   async function loadData() {
//     try {
//       setLoading(true);
//       setError('');

//       const cachedAds = localStorage.getItem('carAds');
//       if (cachedAds) {
//         setAds(JSON.parse(cachedAds));
//       }

//       let headers = {};
//       if (isAuthenticated) {
//         const token = await getAccessTokenSilently();
//         headers = { Authorization: `Bearer ${token}` };
//       }

//       const response = await axios.get(`${server_url}/api/load`, { headers });
//       console.log('Fetched ads:', response.data.ads);
//       setAds(response.data.ads);
//       localStorage.setItem('carAds', JSON.stringify(response.data.ads));
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError('Failed to load ads. Showing sample data instead.');
//       setAds(dummyAds);
//       localStorage.setItem('carAds', JSON.stringify(dummyAds));
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!authLoading) {
//       loadData();
//     }
//   }, [authLoading]);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredAds(ads);
//     } else {
//       const filtered = ads.filter((ad) =>
//         ad.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredAds(filtered);
//     }
//     setCurrentPage(1);
//   }, [ads, searchQuery]);

//   const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedAds = filteredAds.slice(startIndex, endIndex);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleImageError = (e) => {
//     e.target.src = 'https://via.placeholder.com/160x120?text=No+Image';
//   };

//   const handleAdClick = (adId) => {
//     localStorage.setItem('selectedAdId', adId);
//     navigate('/preview');
//   };

//   async function likeAd(adId) {
//     try {
//       const headers = isAuthenticated ? {
//         Authorization: `Bearer ${await getAccessTokenSilently()}`
//       } : {};

//       const response = await axios.post(`${server_url}/api/like/${adId}`, {
//         email
//       }, { headers });

//       console.log('Like response:', response.data);

//       setAds(prevAds => {
//         const updatedAds = prevAds.map(ad =>
//           ad._id === adId
//             ? {
//                 ...ad,
//                 likes: response.data.liked
//                   ? [...(ad.likes || []), email]
//                   : (ad.likes || []).filter(e => e !== email)
//               }
//             : ad
//         );
//         localStorage.setItem('carAds', JSON.stringify(updatedAds));
//         return updatedAds;
//       });

//       setFilteredAds(prevFiltered => prevFiltered.map(ad =>
//         ad._id === adId
//           ? {
//               ...ad,
//               likes: response.data.liked
//                 ? [...(ad.likes || []), email]
//                 : (ad.likes || []).filter(e => e !== email)
//             }
//           : ad
//       ));
//     } catch (error) {
//       console.error('Error liking ad:', error);
//       setError('Failed to update like status');
//     }
//   }

//   return (
//     <div className="min-h-screen bg-white font-sans">
//       <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         {loading && !ads.length && (
//           <p className="text-center text-gray-600">Loading ads...</p>
//         )}
//         {error && (
//           <p className="text-center text-red-600 mb-4">{error}</p>
//         )}
//         {!loading && filteredAds.length === 0 && (
//           <p className="text-center text-gray-600">No ads match your search.</p>
//         )}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
//           {paginatedAds.map((ad) => (
//             <div
//               key={ad._id}
//               className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-300"
//               onClick={() => handleAdClick(ad._id)}
//             >
//               <div className="relative">
//                 <img
//                   src={ad.postImage && ad.postImage[0] ? `${server_url}/${ad.postImage[0]}` : 'https://via.placeholder.com/160x120?text=No+Image'}
//                   alt={ad.name || 'Car Ad'}
//                   className="h-48 w-full object-cover object-center rounded mt-2 mb-2 mx-2"
//                   onError={handleImageError}
//                 />
//                 {ad.featured && (
//                   <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold text-gray-900 mx-2 px-2 py-1 uppercase">
//                     Featured
//                   </span>
//                 )}
//                 <button
//                   className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-200 mx-2"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     likeAd(ad._id);
//                   }}
//                   aria-label={ad.likes?.includes(email) ? "Unlike ad" : "Like ad"}
//                 >
//                   <svg
//                     className={`w-5 h-5 ${ad.likes?.includes(email) ? 'text-red-400' : 'text-gray-600'}`}
//                     fill={ad.likes?.includes(email) ? 'currentColor' : 'none'}
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <div className="p-4">
//                 <p className="text-lg font-semibold text-gray-900">₹ {ad.price.toLocaleString()}</p>
//                 <p className="text-sm text-gray-700 font-medium truncate">{ad.name}</p>
//                 <p className="text-sm text-gray-500">{ad.brand}</p>
//                 <div className="flex justify-between">
//                   <p className="text-xs text-gray-400 mt-1">{ad.location.city}</p>
//                   <p className="text-xs text-gray-400 mt-1">{getPostedTime(ad.posted)}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredAds.length > itemsPerPage && (
//           <div className="flex justify-center mt-8">
//             <nav className="flex items-center space-x-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
//               >
//                 ←
//               </button>

//               {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-3 py-1 rounded-md ${
//                     currentPage === page
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
//               >
//                 →
//               </button>
//             </nav>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;




















