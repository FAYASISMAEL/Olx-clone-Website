import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSearch } from '../context/search/Search';
import { toast } from 'react-toastify';

const Liked = () => {
  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const server_url = 'http://localhost:3000';

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      localStorage.removeItem('carAds');
      console.log('Cleared carAds cache');

      const response = await axios.get(`${server_url}/api/load`);
      console.log('Raw backend response:', response.data);

      const fetchedAds = response.data.ads.filter(ad => ad.like.includes(email));

      setAds([...fetchedAds]);
      localStorage.setItem('carAds', JSON.stringify(fetchedAds));
      console.log('Updated ads state:', fetchedAds);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load ads.');
      setAds([]);
      localStorage.setItem('carAds', JSON.stringify([]));
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const checkEmail = () => {
      const newEmail = localStorage.getItem('email') || '';
      if (newEmail !== email) {
        console.log('Email updated:', newEmail);
        setEmail(newEmail);
      }
    };

    checkEmail();
    const interval = setInterval(checkEmail, 1000);

    return () => clearInterval(interval);
  }, [email]);

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
    return posted || 'Just now';
  };

  const handleAdClick = (adId) => {
    localStorage.setItem('selectedAdId', adId);
    navigate('/preview');
  };

  async function likePost(adId, e) {
    e.stopPropagation();

    if (!email) {
      toast.error('Please log in to like a post.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const prevAds = [...ads];
    const prevFilteredAds = [...filteredAds];

    const isCurrentlyLiked = ads.find(ad => ad._id === adId)?.like.includes(email);
    if (isCurrentlyLiked) {
      setAds(prevAds => prevAds.filter(ad => ad._id !== adId));
      setFilteredAds(prevFiltered => prevFiltered.filter(ad => ad._id !== adId));
    }

    try {
      const response = await axios.post(`${server_url}/api/like/${adId}`, { email });
      const { message, post } = response.data;
      console.log('Like response:', { adId, message, likeArray: post.like });

      if (!post.like.includes(email)) {
        setAds(prevAds => prevAds.filter(ad => ad._id !== adId));
        setFilteredAds(prevFiltered => prevFiltered.filter(ad => ad._id !== adId));
      } else {
        setAds(prevAds =>
          prevAds.map(ad =>
            ad._id === adId ? { ...ad, like: Array.isArray(post.like) ? post.like : [] } : ad
          )
        );
        setFilteredAds(prevFiltered =>
          prevFiltered.map(ad =>
            ad._id === adId ? { ...ad, like: Array.isArray(post.like) ? post.like : [] } : ad
          )
        );
      }

      localStorage.setItem('carAds', JSON.stringify(ads.filter(ad => ad._id !== adId)));

      toast.success(message, {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      setAds(prevAds);
      setFilteredAds(prevFilteredAds);
      toast.error('Failed to update like status.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }

  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const indexOfLastAd = currentPage * itemsPerPage;
  const indexOfFirstAd = indexOfLastAd - itemsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

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
          <p className="text-center text-gray-600">No liked ads found.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {currentAds.map((ad) => {
            const isLiked = email && Array.isArray(ad.like) && ad.like.includes(email);
            console.log('Ad ID:', ad._id, 'Email:', email, 'Likes:', ad.like, 'Is Liked:', isLiked);
            return (
              <div
                key={ad._id}
                className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-300"
                onClick={() => handleAdClick(ad._id)}
              >
                <div className="relative">
                  <img
                    src={
                      ad.postImage && ad.postImage[0]
                        ? `${server_url}/${ad.postImage[0]}`
                        : 'https://via.placeholder.com/160x120?text=No+Image'
                    }
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
                    onClick={(e) => likePost(ad._id, e)}
                  >
                    <svg
                      className={`w-5 h-5 ${isLiked ? 'text-red-600 fill-red-600' : 'text-gray-600'}`}
                      fill={isLiked ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 font-medium truncate">{ad.name}</p>
                  <p className="text-lg font-semibold text-gray-900">₹ {ad.price.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white'
              }`}
            >
              ←
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === number
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white'
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

export default Liked;

































// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useSearch } from '../context/search/Search';
// import { toast } from 'react-toastify';

// const Liked = () => {
//   const { searchQuery } = useSearch();
//   const navigate = useNavigate();

//   const [ads, setAds] = useState([]);
//   const [filteredAds, setFilteredAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [email, setEmail] = useState(localStorage.getItem('email') || '');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(8);

//   const server_url = 'http://localhost:3000';

//   async function loadData() {
//     try {
//       setLoading(true);
//       setError('');

//       localStorage.removeItem('carAds');
//       console.log('Cleared carAds cache');

//       const response = await axios.get(`${server_url}/api/load`);
//       console.log('Raw backend response:', response.data);
//     //   const fetchedAds = response.data.ads.map(ad => ({
//     //     ...ad,
//     //     like: Array.isArray(ad.like) ? ad.like : []
//     //   }));

//     const fetchedAds = response.data.ads.filter(ad=>ad.like.includes(email))

//       setAds([...fetchedAds]);
//       localStorage.setItem('carAds', JSON.stringify(fetchedAds));
//       console.log('Updated ads state:', fetchedAds);

//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError('Failed to load ads.');
//       setAds([]);
//       localStorage.setItem('carAds', JSON.stringify([]));
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   useEffect(() => {
//     const checkEmail = () => {
//       const newEmail = localStorage.getItem('email') || '';
//       if (newEmail !== email) {
//         console.log('Email updated:', newEmail);
//         setEmail(newEmail);
//       }
//     };

//     checkEmail();
//     const interval = setInterval(checkEmail, 1000);

//     return () => clearInterval(interval);
//   }, [email]);

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

//   const handleImageError = (e) => {
//     e.target.src = 'https://via.placeholder.com/160x120?text=No+Image';
//   };

//   const getPostedTime = (posted) => {
//     return posted || 'Just now';
//   };

//   const handleAdClick = (adId) => {
//     localStorage.setItem('selectedAdId', adId);
//     navigate('/preview');
//   };

//   async function likePost(adId, e) {
//     e.stopPropagation();

//     if (!email) {
//       toast.error('Please log in to like a post.', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(`${server_url}/api/like/${adId}`, { email });
//       const { message, post } = response.data;
//       console.log('Like response:', { adId, message, likeArray: post.like });

//       setAds((prevAds) =>
//         prevAds.map((ad) =>
//           ad._id === adId ? { ...ad, like: Array.isArray(post.like) ? post.like : [] } : ad
//         )
//       );

//       toast.success(message, {
//         position: 'top-right',
//         autoClose: 2000,
//       });
//     } catch (error) {
//       console.error('Error liking/unliking post:', error);
//       toast.error('Failed to update like status.', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//     }
//   }

//   const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
//   const indexOfLastAd = currentPage * itemsPerPage;
//   const indexOfFirstAd = indexOfLastAd - itemsPerPage;
//   const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const pageNumbers = [];
//   const maxPagesToShow = 5;
//   let startPage = Math.max(1, currentPage - 2);
//   let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

//   if (endPage - startPage + 1 < maxPagesToShow) {
//     startPage = Math.max(1, endPage - maxPagesToShow + 1);
//   }

//   for (let i = startPage; i <= endPage; i++) {
//     pageNumbers.push(i);
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
//           {currentAds.map((ad) => {
//             const isLiked = email && Array.isArray(ad.like) && ad.like.includes(email);
//             console.log('Ad ID:', ad._id, 'Email:', email, 'Likes:', ad.like, 'Is Liked:', isLiked);
//             return (
//               <div
//                 key={ad._id}
//                 className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-300"
//                 onClick={() => handleAdClick(ad._id)}
//               >
//                 <div className="relative">
//                   <img
//                     src={
//                       ad.postImage && ad.postImage[0]
//                         ? `${server_url}/${ad.postImage[0]}`
//                         : 'https://via.placeholder.com/160x120?text=No+Image'
//                     }
//                     alt={ad.name || 'Car Ad'}
//                     className="h-48 w-full object-cover object-center rounded mt-2 mb-2 mx-2"
//                     onError={handleImageError}
//                   />
//                   {ad.featured && (
//                     <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold text-gray-900 mx-2 px-2 py-1 uppercase">
//                       Featured
//                     </span>
//                   )}
//                   <button
//                     className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100 mx-2 cursor-pointer"
//                     onClick={(e) => likePost(ad._id, e)}
//                   >
//                     <svg
//                       className={`w-5 h-5 ${isLiked ? 'text-red-600 fill-red-600' : 'text-gray-600'}`}
//                       fill={isLiked ? 'currentColor' : 'none'}
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                       ></path>
//                     </svg>
//                   </button>
//                 </div>
//                 <div className="p-4">
//                   <p className="text-sm text-gray-700 font-medium truncate">{ad.name}</p>
//                   <p className="text-lg font-semibold text-gray-900">₹ {ad.price.toLocaleString()}</p>
                  
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-8 space-x-2">
//             <button
//               onClick={handlePrevious}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-md ${
//                 currentPage === 1
//                   ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                   : 'bg-blue-500 text-white'
//               }`}
//             >
//               ←
//             </button>

//             {pageNumbers.map((number) => (
//               <button
//                 key={number}
//                 onClick={() => handlePageChange(number)}
//                 className={`px-4 py-2 rounded-md ${
//                   currentPage === number
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-200 text-gray-700'
//                 }`}
//               >
//                 {number}
//               </button>
//             ))}

//             <button
//               onClick={handleNext}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded-md ${
//                 currentPage === totalPages
//                   ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                   : 'bg-blue-500 text-white'
//               }`}
//             >
//               →
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Liked;
