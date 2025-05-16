import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useSearch } from '../context/search/Search';
import './Navbar.css';

import logo from '../../assets/symbol.png';
import search from '../../assets/search1.svg';
import arrow from '../../assets/arrow-down.svg';
import searchWt from '../../assets/search.svg';
import addBtn from '../../assets/addButton.png';
import like from '../../assets/like.svg';
import message from '../../assets/message.svg';

const DEFAULT_PROFILE_PICTURE = '';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const { setSearchQuery } = useSearch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem('profilePicture') || DEFAULT_PROFILE_PICTURE
  );

  useEffect(() => {
    console.log('Auth0 State:', { isLoading, isAuthenticated, user })
  }, [isLoading, isAuthenticated, user]);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user?.email) {
      localStorage.setItem('email', user.email);
      if (user?.picture) {
        localStorage.setItem('profilePicture', user.picture);
        setProfilePicture(user.picture);
      }
      console.log('User logged in, email stored:', user.email);
    } else {
      if (!localStorage.getItem('email')) {
        setProfilePicture(DEFAULT_PROFILE_PICTURE);
      }
    }
  }, [isAuthenticated, user, isLoading]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('profilePicture');
    setProfilePicture(DEFAULT_PROFILE_PICTURE);
    setIsDropdownOpen(false);
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleNavigation = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  async function redFav() {
    
    navigate("/like")
  }

  return (
    <div className="relative z-[1000]">
      <nav className="fixed top-0 w-full overflow-auto p-2 pl-3 pr-3 shadow-md bg-slate-100 border-b-4 border-solid border-b-white flex items-center z-[500]">

        {/* Logo */}
        <img src={logo} alt="Logo" className="w-12" />

        {/* Location Search */}
        <div className="relative location-search ml-5">
          <img src={search} alt="Search Icon" className="absolute top-4 left-2 w-5" />
          <input
            placeholder="Search city, area, or locality..."
            className="w-[50px] sm:w-[150px] md:w-[250px] lg:w-[270px] p-3 pl-8 pr-8 border-2 border-black rounded-md placeholder:text-ellipsis"
            type="text"
          />
          <img src={arrow} alt="Arrow Down" className="absolute top-4 right-3 w-5 cursor-pointer" />
        </div>

        {/* Main Search */}
        <div className="ml-5 mr-2 relative w-full main-search">
          <input
            placeholder="Find Cars, Mobile Phones, and More..."
            className="w-full p-3 border-2 border-black rounded-md placeholder:text-ellipsis"
            type="text"
            onChange={handleSearchChange}
          />
          <div className="flex justify-center items-center absolute top-0 right-0 h-full rounded-e-md w-12 bg-[#002f34] cursor-pointer">
            <img className="w-5 filter invert" src={searchWt} alt="Search Icon" />
          </div>
        </div>

        {/* Language */}
        <div className="mx-1 sm:ml-5 sm:mr-5 relative lang flex items-center">
          <p className="font-bold mr-3">English</p>
          <img src={arrow} alt="Arrow Down" className="w-5 cursor-pointer" />
        </div>

        {/* Like Button */}
        <img src={like} alt="Like Icon" onClick={redFav} className="w-8 h-8 sm:w-13 sm:h-8 cursor-pointer mx-1 sm:ml-5" />

        {/* Message Button */}
        <img src={message} alt="Message Icon" className="w-8 h-8 sm:w-13 sm:h-8 cursor-pointer mx-1 sm:ml-5 sm:mr-5" />

        {/* Profile */}
        <div className="ml-5">
          {isAuthenticated ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-10 h-10 sm:w-15 sm:h-10 rounded-full mr-2 cursor-pointer"
              onClick={toggleDropdown}
            />
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="font-bold underline cursor-pointer"
              style={{ color: '#002f34' }}
            >
              Login
            </button>
          )}
        </div>

        {/* Sell Button */}
        <img
          src={addBtn}
          onClick={() => handleNavigation('/sell')}
          className="w-24 mx-1 sm:ml-5 sm:mr-5 shadow-xl rounded-full cursor-pointer"
          alt="Sell Button"
        />
      </nav>

      {/* Dropdown Menu */}
      {isDropdownOpen && isAuthenticated && (
        <div className="fixed right-16 top-14 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[1001]">

          {/* Profile Section */}
          <div className="p-4 border-b border-gray-200 flex items-center">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-2 object-cover aspect-square profile-img"
            />
            <div>
              <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
              <button className="text-white bg-blue-600 rounded-lg px-3 py-1 mt-1 text-sm hover:bg-blue-700 transition cursor-pointer">
                View and edit profile
              </button>
            </div>
          </div>

          {/* Dropdown section */}
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2">
              <img src="https://statics.olx.in/external/base/img/myAds.svg" alt="My Ads Icon" />
              My ADS
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2">
              <svg width="23px" height="23px" viewBox="0 0 1024 1024" fillRule="evenodd">
                <path className="rui-w4DG7" d="M426.667 42.667h170.667l42.667 42.667-42.667 42.667h256l42.667 42.667v768l-42.667 42.667h-682.667l-42.667-42.667v-768l42.667-42.667h256l-42.667-42.667 42.667-42.667zM213.333 896h597.333v-682.667h-597.333v682.667zM469.333 426.667v-85.333h256v85.333h-256zM298.667 426.667v-85.333h85.333v85.333h-85.333zM469.333 597.333v-85.333h256v85.333h-256zM298.667 597.333v-85.333h85.333v85.333h-85.333zM469.333 768v-85.333h256v85.333h-256zM298.667 768v-85.333h85.333v85.333h-85.333z" />
              </svg>
              Paid Packages & Billing
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2">
              <svg width="23px" height="23px" viewBox="0 0 1024 1024" data-aut-id="icon" class="" fill-rule="evenodd"><path class="rui-w4DG7" d="M899.285 256l39.381 39.083v476.501l-39.381 39.083h-774.571l-39.381-39.083v-476.501l39.381-39.083h774.571zM853.461 511.573h-681.6v213.632h681.6v-213.632zM693.205 618.411h76.459l34.901 32.213-34.901 32.213h-128.896l-34.901-32.213 34.901-32.213h52.437zM853.461 341.248h-681.387v86.357l681.387-2.347v-84.053z"></path></svg>
              Brought Package & Billing
            </li>
            <li className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold flex items-center gap-2">
              <svg width="23px" height="23px" viewBox="0 0 1024 1024" data-aut-id="icon" class="" fill-rule="evenodd"><path class="rui-w4DG7" d="M550.789 744.728c0 21.41-17.377 38.789-38.789 38.789s-38.789-17.377-38.789-38.789 17.377-38.789 38.789-38.789 38.789 17.377 38.789 38.789zM686.546 415.030c0 82.89-58.105 152.513-135.757 170.201v43.131l-38.789 38.789-38.789-38.789v-77.575l38.789-38.789c53.489 0 96.97-43.481 96.97-96.97s-43.481-96.97-96.97-96.97-96.97 43.481-96.97 96.97l-38.789 38.789-38.789-38.789c0-96.232 78.312-174.546 174.546-174.546s174.546 78.312 174.546 174.546zM512 861.090c-192.505 0-349.090-156.626-349.090-349.090 0-192.505 156.587-349.090 349.090-349.090 192.466 0 349.090 156.587 349.090 349.090 0 192.466-156.626 349.090-349.090 349.090zM512 85.333c-235.288 0-426.667 191.379-426.667 426.667s191.379 426.667 426.667 426.667 426.667-191.379 426.667-426.667-191.379-426.667-426.667-426.667z"></path></svg>
              Help
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2">
              <svg width="23px" height="23px" viewBox="0 0 1024 1024" fillRule="evenodd">
                <path className="rui-w4DG7" d="M873.997 456.711H819.182C811.047 414.001 794.347 374.323 770.704 339.651L809.444 300.892V259.727L767.653 217.918H726.489L687.73 256.677C653.058 233.054 613.38 216.334 570.67 208.199V153.384L541.552 124.266H482.455L453.337 153.384V208.199C410.628 216.334 370.949 233.054 336.277 256.677L297.518 217.918H256.334L214.544 259.727V300.892L253.303 339.651C229.661 374.323 212.96 414.001 204.825 456.711H150.011L120.893 485.829V544.926L150.011 574.044H204.825C212.96 616.753 229.661 656.431 253.303 691.103L214.544 729.863V771.047L256.334 812.837H297.518L336.277 774.078C370.949 797.72 410.628 814.421 453.337 822.556V877.37L482.455 906.488H541.552L570.67 877.37V822.556C613.38 814.421 653.058 797.72 687.73 774.078L726.489 812.837H767.653L809.444 771.047V729.863L770.704 691.103C794.347 656.431 811.047 616.753 819.182 574.044H873.997L903.115 544.926V485.829L873.997 456.711ZM512.004 750.044C382.605 750.044 277.337 644.776 277.337 515.377C277.337 385.978 382.605 280.711 512.004 280.711C641.403 280.711 746.67 385.978 746.67 515.377C746.67 644.776 641.403 750.044 512.004 750.044ZM512.004 350.839C421.266 350.839 347.463 424.641 347.463 515.379C347.463 606.117 421.266 679.92 512.004 679.92C602.741 679.92 676.544 606.117 676.544 515.379C676.544 424.641 602.741 350.839 512.004 350.839ZM512.004 601.697C464.405 601.697 425.685 562.977 425.685 515.379C425.685 467.781 464.405 429.061 512.004 429.061C559.602 429.061 598.322 467.781 598.322 515.379C598.322 562.977 559.602 601.697 512.004 601.697Z" />
              </svg>
              Settings
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2">
              <svg width="23px" height="23px" viewBox="0 0 1024 1024" fillRule="evenodd">
                <path className="rui-w4DG7" d="M891.008 822.315l47.659 48.853-47.701 48.085h-757.931l-47.701-48.853 47.787-48.043h757.888zM493.525 85.333l46.507 46.592 0.213 475.179 178.475-189.483 62.976 0.299-0.256 58.752 2.091 4.267-290.005 302.592-291.84-304.512 4.011-4.139 0.256-57.472 62.507 0.213 178.475 189.483 0.171-475.179 46.421-46.592z" />
              </svg>
              Install OLX Lite App
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2"
              onClick={handleLogout}
            >
              <svg width="23px" height="23px" viewBox="0 0 1024 1024" fillRule="evenodd">
                <path className="rui-w4DG7" d="M128 85.333l-42.667 42.667v768l42.667 42.667h768l42.667-42.667v-213.333l-42.667-42.667-42.667 42.667v170.667h-682.667v-682.667h682.667v170.667l42.667 42.667 42.667-42.667v-213.333l-42.667-42.667h-768zM494.336 298.667l-183.168 183.168v60.331l183.168 183.168h60.331v-60.331l-110.336-110.336h323.669l42.667-42.667-42.667-42.667h-323.669l110.336-110.336v-60.331h-60.331z" />
              </svg>
              Logout
            </li>
          </ul>
        </div>
      )}

      {/* Categories */}
      <div className="w-full relative z-0 flex shadow-md p-2 pt-20 pl-10 pr-10 sm:pl-44 md:pr-44 sub-lists">
        <ul className="list-none flex items-center justify-center w-full">
          <div className="flex flex-shrink-0">
            <p className="font-semibold uppercase all-cats cursor-pointer">All categories</p>
            <img className="w-4 ml-2 cursor-pointer" src={arrow} alt="Arrow Down" />
          </div>
          <li className="ml-4">Vehicles</li>
          <li className="ml-4">Electronics</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;





















// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useSearch } from '../context/search/Search';
// import './Navbar.css';

// import logo from '../../assets/symbol.png';
// import search from '../../assets/search1.svg';
// import arrow from '../../assets/arrow-down.svg';
// import searchWt from '../../assets/search.svg';
// import addBtn from '../../assets/addButton.png';
// import like from '../../assets/like.svg';
// import message from '../../assets/message.svg';

// const DEFAULT_PROFILE_PICTURE = 'https://via.placeholder.com/40?text=User';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
//   const { setSearchQuery } = useSearch();

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
//   const [profilePicture, setProfilePicture] = useState(
//     localStorage.getItem('profilePicture') || DEFAULT_PROFILE_PICTURE
//   );

//   useEffect(() => {
//     if (isLoading) return;

//     if (isAuthenticated && user?.email) {
//       localStorage.setItem('email', user.email);
//       if (user?.picture) {
//         localStorage.setItem('profilePicture', user.picture);
//         setProfilePicture(user.picture);
//       }
//       console.log('User logged in, email stored:', user.email);
//     } else {
//       if (!localStorage.getItem('email')) {
//         setProfilePicture(DEFAULT_PROFILE_PICTURE);
//       }
//     }
//   }, [isAuthenticated, user, isLoading]);

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev);
//     setIsHamburgerOpen(false); // Close hamburger menu if open
//   };

//   const toggleHamburger = () => {
//     setIsHamburgerOpen((prev) => !prev);
//     setIsDropdownOpen(false); // Close profile dropdown if open
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('email');
//     localStorage.removeItem('profilePicture');
//     setProfilePicture(DEFAULT_PROFILE_PICTURE);
//     setIsDropdownOpen(false);
//     setIsHamburgerOpen(false);
//     logout({ logoutParams: { returnTo: window.location.origin } });
//   };

//   const handleNavigation = (path) => {
//     setIsDropdownOpen(false);
//     setIsHamburgerOpen(false);
//     navigate(path);
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   if (isLoading) {
//     return <div className="text-center p-4">Loading...</div>;
//   }

//   return (
//     <div className="relative z-[1000]">
//       <nav className="fixed top-0 w-full p-2 sm:p-3 shadow-md bg-slate-100 border-b-4 border-solid border-b-white flex items-center justify-between z-[500]">

//         {/* Logo */}
//         <img src={logo} alt="Logo" className="w-10 sm:w-12" />

//         {/* Desktop Elements (Hidden on Mobile) */}
//         <div className="hidden sm:flex items-center flex-1">
//           {/* Location Search */}
//           <div className="relative location-search ml-3 sm:ml-5">
//             <img src={search} alt="Search Icon" className="absolute top-4 left-2 w-4 sm:w-5" />
//             <input
//               placeholder="Search city, area, or locality..."
//               className="w-[150px] md:w-[250px] lg:w-[270px] p-3 pl-8 pr-8 border-2 border-black rounded-md placeholder:text-ellipsis text-sm sm:text-base"
//               type="text"
//             />
//             <img src={arrow} alt="Arrow Down" className="absolute top-4 right-3 w-4 sm:w-5 cursor-pointer" />
//           </div>

//           {/* Main Search */}
//           <div className="ml-3 sm:ml-5 mr-2 relative flex-1 main-search">
//             <input
//               placeholder="Find Cars, Mobile Phones, and More..."
//               className="w-full p-3 border-2 border-black rounded-md placeholder:text-ellipsis text-sm sm:text-base"
//               type="text"
//               onChange={handleSearchChange}
//             />
//             <div className="flex justify-center items-center absolute top-0 right-0 h-full rounded-e-md w-10 sm:w-12 bg-[#002f34] cursor-pointer">
//               <img className="w-4 sm:w-5 filter invert" src={searchWt} alt="Search Icon" />
//             </div>
//           </div>

//           {/* Language */}
//           <div className="mx-1 sm:ml-5 sm:mr-5 relative lang flex items-center">
//             <p className="font-bold mr-3 text-sm sm:text-base">English</p>
//             <img src={arrow} alt="Arrow Down" className="w-4 sm:w-5 cursor-pointer" />
//           </div>
//         </div>

//         {/* Always Visible Elements */}
//         <div className="flex items-center">
//           {/* Like Button (Hidden on Mobile, Shown in Hamburger) */}
//           <img
//             src={like}
//             alt="Like Icon"
//             className="w-10 sm:w-12 cursor-pointer mx-1 sm:ml-5 hidden sm:block"
//             onClick={() => navigate('/liked')}
//             aria-label="View liked items"
//           />

//           {/* Message Button (Hidden on Mobile, Shown in Hamburger) */}
//           <img
//             src={message}
//             alt="Message Icon"
//             className="w-10 sm:w-12 cursor-pointer mx-1 sm:ml-5 sm:mr-5 hidden sm:block"
//             onClick={() => navigate('/messages')}
//             aria-label="View messages"
//           />

//           {/* Profile */}
//           <div className="mx-1 sm:ml-5">
//             {isAuthenticated ? (
//               <img
//                 src={profilePicture}
//                 alt="Profile"
//                 className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer object-cover aspect-square profile-img"
//                 onClick={toggleDropdown}
//                 onError={(e) => (e.target.src = DEFAULT_PROFILE_PICTURE)}
//                 aria-label="Toggle profile menu"
//               />
//             ) : (
//               <button
//                 onClick={() => loginWithRedirect()}
//                 className="font-bold underline cursor-pointer text-sm sm:text-base"
//                 style={{ color: '#002f34' }}
//               >
//                 Login
//               </button>
//             )}
//           </div>

//           {/* Sell Button (Hidden on Mobile, Shown in Hamburger) */}
//           <img
//             src={addBtn}
//             onClick={() => handleNavigation('/sell')}
//             className="w-20 sm:w-24 mx-1 sm:ml-5 sm:mr-5 shadow-xl rounded-full cursor-pointer hidden sm:block"
//             alt="Sell Button"
//             aria-label="Sell an item"
//           />

//           {/* Hamburger Menu (Visible on Mobile) */}
//           <button
//             className="sm:hidden mx-1 focus:outline-none"
//             onClick={toggleHamburger}
//             aria-label="Toggle menu"
//           >
//             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d={isHamburgerOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
//               />
//             </svg>
//           </button>
//         </div>
//       </nav>

//       {/* Hamburger Menu Dropdown (Mobile Only) */}
//       {isHamburgerOpen && (
//         <div className="fixed top-14 left-0 w-full bg-white border-b border-gray-200 shadow-lg z-[1001] sm:hidden">
//           <div className="p-4">
//             {/* Main Search */}
//             <div className="relative main-search mb-4">
//               <input
//                 placeholder="Find Cars, Mobile Phones, and More..."
//                 className="w-full p-3 border-2 border-black rounded-md placeholder:text-ellipsis text-sm"
//                 type="text"
//                 onChange={handleSearchChange}
//               />
//               <div className="flex justify-center items-center absolute top-0 right-0 h-full rounded-e-md w-10 bg-[#002f34] cursor-pointer">
//                 <img className="w-4 filter invert" src={searchWt} alt="Search Icon" />
//               </div>
//             </div>

//             {/* Like Button */}
//             <button
//               className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"
//               onClick={() => {
//                 navigate('/liked');
//                 setIsHamburgerOpen(false);
//               }}
//             >
//               <img src={like} alt="Like Icon" className="w-6 mr-2" />
//               Liked Items
//             </button>

//             {/* Message Button */}
//             <button
//               className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"
//               onClick={() => {
//                 navigate('/messages');
//                 setIsHamburgerOpen(false);
//               }}
//             >
//               <img src={message} alt="Message Icon" className="w-6 mr-2" />
//               Messages
//             </button>

//             {/* Sell Button */}
//             <button
//               className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"
//               onClick={() => handleNavigation('/sell')}
//             >
//               <img src={addBtn} alt="Sell Button" className="w-6 mr-2" />
//               Sell an Item
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Profile Dropdown Menu */}
//       {isDropdownOpen && isAuthenticated && (
//         <div className="fixed right-4 sm:right-16 top-14 w-56 sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[1001]">

//           {/* Profile Section */}
//           <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center">
//             <img
//               src={profilePicture}
//               alt="Profile"
//               className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 object-cover aspect-square profile-img"
//               onError={(e) => (e.target.src = DEFAULT_PROFILE_PICTURE)}
//             />
//             <div>
//               <p className="font-semibold text-gray-800 text-sm sm:text-base">{user?.name || 'User'}</p>
//               <button className="text-white bg-blue-600 rounded-lg px-2 sm:px-3 py-1 mt-1 text-xs sm:text-sm hover:bg-blue-700 transition cursor-pointer">
//                 View and edit profile
//               </button>
//             </div>
//           </div>

//           {/* Dropdown Section */}
//           <ul className="py-2">
//             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2 text-sm sm:text-base">
//               <img src="https://statics.olx.in/external/base/img/myAds.svg" alt="My Ads Icon" className="w-5 sm:w-6" />
//               My ADS
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2 text-sm sm:text-base">
//               <svg width="20px" height="20px" viewBox="0 0 1024 1024" fillRule="evenodd" className="sm:w-[23px] sm:h-[23px]">
//                 <path className="rui-w4DG7" d="M426.667 42.667h170.667l42.667 42.667-42.667 42.667h256l42.667 42.667v768l-42.667 42.667h-682.667l-42.667-42.667v-768l42.667-42.667h256l-42.667-42.667 42.667-42.667zM213.333 896h597.333v-682.667h-597.333v682.667zM469.333 426.667v-85.333h256v85.333h-256zM298.667 426.667v-85.333h85.333v85.333h-85.333zM469.333 597.333v-85.333h256v85.333h-256zM298.667 597.333v-85.333h85.333v85.333h-85.333zM469.333 768v-85.333h256v85.333h-256zM298.667 768v-85.333h85.333v85.333h-85.333z" />
//               </svg>
//               Paid Packages & Billing
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2 text-sm sm:text-base">
//               <svg width="20px" height="20px" viewBox="0 0 1024 1024" data-aut-id="icon" className="sm:w-[23px] sm:h-[23px]" fillRule="evenodd">
//                 <path className="rui-w4DG7" d="M899.285 256l39.381 39.083v476.501l-39.381 39.083h-774.571l-39.381-39.083v-476.501l39.381-39.083h774.571zM853.461 511.573h-681.6v213.632h681.6v-213.632zM693.205 618.411h76.459l34.901 32.213-34.901 32.213h-128.896l-34.901-32.213 34.901-32.213h52.437zM853.461 341.248h-681.387v86.357l681.387-2.347v-84.053z"></path>
//               </svg>
//               Bought Package & Billing
//             </li>
//             <li className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold flex items-center gap-2 text-sm sm:text-base">
//               <svg width="20px" height="20px" viewBox="0 0 1024 1024" data-aut-id="icon" className="sm:w-[23px] sm:h-[23px]" fillRule="evenodd">
//                 <path className="rui-w4DG7" d="M550.789 744.728c0 21.41-17.377 38.789-38.789 38.789s-38.789-17.377-38.789-38.789 17.377-38.789 38.789-38.789 38.789 17.377 38.789 38.789zM686.546 415.030c0 82.89-58.105 152.513-135.757 170.201v43.131l-38.789 38.789-38.789-38.789v-77.575l38.789-38.789c53.489 0 96.97-43.481 96.97-96.97s-43.481-96.97-96.97-96.97-96.97 43.481-96.97 96.97l-38.789 38.789-38.789-38.789c0-96.232 78.312-174.546 174.546-174.546s174.546 78.312 174.546 174.546zM512 861.090c-192.505 0-349.090-156.626-349.090-349.090 0-192.505 156.587-349.090 349.090-349.090 192.466 0 349.090 156.587 349.090 349.090 0 192.466-156.626 349.090-349.090 349.090zM512 85.333c-235.288 0-426.667 191.379-426.667 426.667s191.379 426.667 426.667 426.667 426.667-191.379 426.667-426.667-191.379-426.667-426.667-426.667z"></path>
//               </svg>
//               Help
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2 text-sm sm:text-base">
//               <svg width="20px" height="20px" viewBox="0 0 1024 1024" fillRule="evenodd" className="sm:w-[23px] sm:h-[23px]">
//                 <path className="rui-w4DG7" d="M873.997 456.711H819.182C811.047 414.001 794.347 374.323 770.704 339.651L809.444 300.892V259.727L767.653 217.918H726.489L687.73 256.677C653.058 233.054 613.38 216.334 570.67 208.199V153.384L541.552 124.266H482.455L453.337 153.384V208.199C410.628 216.334 370.949 233.054 336.277 256.677L297.518 217.918H256.334L214.544 259.727V300.892L253.303 339.651C229.661 374.323 212.96 414.001 204.825 456.711H150.011L120.893 485.829V544.926L150.011 574.044H204.825C212.96 616.753 229.661 656.431 253.303 691.103L214.544 729.863V771.047L256.334 812.837H297.518L336.277 774.078C370.949 797.72 410.628 814.421 453.337 822.556V877.37L482.455 906.488H541.552L570.67 877.37V822.556C613.38 814.421 653.058 797.72 687.73 774.078L726.489 812.837H767.653L809.444 771.047V729.863L770.704 691.103C794.347 656.431 811.047 616.753 819.182 574.044H873.997L903.115 544.926V485.829L873.997 456.711ZM512.004 750.044C382.605 750.044 277.337 644.776 277.337 515.377C277.337 385.978 382.605 280.711 512.004 280.711C641.403 280.711 746.67 385.978 746.67 515.377C746.67 644.776 641.403 750.044 512.004 750.044ZM512.004 350.839C421.266 350.839 347.463 424.641 347.463 515.379C347.463 606.117 421.266 679.92 512.004 679.92C602.741 679.92 676.544 606.117 676.544 515.379C676.544 424.641 602.741 350.839 512.004 350.839ZM512.004 601.697C464.405 601.697 425.685 562.977 425.685 515.379C425.685 467.781 464.405 429.061 512.004 429.061C559.602 429.061 598.322 467.781 598.322 515.379C598.322 562.977 559.602 601.697 512.004 601.697Z" />
//               </svg>
//               Settings
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2 text-sm sm:text-base">
//               <svg width="20px" height="20px" viewBox="0 0 1024 1024" fillRule="evenodd" className="sm:w-[23px] sm:h-[23px]">
//                 <path className="rui-w4DG7" d="M891.008 822.315l47.659 48.853-47.701 48.085h-757.931l-47.701-48.853 47.787-48.043h757.888zM493.525 85.333l46.507 46.592 0.213 475.179 178.475-189.483 62.976 0.299-0.256 58.752 2.091 4.267-290.005 302.592-291.84-304.512 4.011-4.139 0.256-57.472 62.507 0.213 178.475 189.483 0.171-475.179 46.421-46.592z" />
//               </svg>
//               Install OLX Lite App
//             </li>
//             <li
//               className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 gap-2 text-sm sm:text-base"
//               onClick={handleLogout}
//             >
//               <svg width="20px" height="20px" viewBox="0 0 1024 1024" fillRule="evenodd" className="sm:w-[23px] sm:h-[23px]">
//                 <path className="rui-w4DG7" d="M128 85.333l-42.667 42.667v768l42.667 42.667h768l42.667-42.667v-213.333l-42.667-42.667-42.667 42.667v170.667h-682.667v-682.667h682.667v170.667l42.667 42.667 42.667-42.667v-213.333l-42.667-42.667h-768zM494.336 298.667l-183.168 183.168v60.331l183.168 183.168h60.331v-60.331l-110.336-110.336h323.669l42.667-42.667-42.667-42.667h-323.669l110.336-110.336v-60.331h-60.331z" />
//               </svg>
//               Logout
//             </li>
//           </ul>
//         </div>
//       )}

//       {/* Categories */}
//       <div className="w-full relative z-0 hidden sm:flex shadow-md p-2 pt-20 pl-10 pr-10 md:pl-44 md:pr-44 sub-lists">
//         <ul className="list-none flex items-center justify-center w-full">
//           <div className="flex flex-shrink-0">
//             <p className="font-semibold uppercase all-cats cursor-pointer text-sm md:text-base">All categories</p>
//             <img className="w-4 ml-2 cursor-pointer" src={arrow} alt="Arrow Down" />
//           </div>
//           <li className="ml-4 text-sm md:text-base">Vehicles</li>
//           <li className="ml-4 text-sm md:text-base">Electronics</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Navbar;