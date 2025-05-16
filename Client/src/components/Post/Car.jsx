import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Car = () => {
  const [formData, setFormData] = useState({
    brand: '',
    carName: '',
    year: '',
    fuel: '',
    transmission: '',
    noOfOwners: '',
    adTitle: '',
    description: '',
    price: '',
    kmDriven: '',
    images: [],
    category: 'car',
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [location, setLocation] = useState({
    state: '',
    district: '',
    city: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const states = [
    {
      name: 'Kerala',
      cities: [
        { name: 'Thiruvananthapuram', city: ['Neyyatinkara', 'Nedumangad', 'Attingal', 'Varkala'] },
        { name: 'Kollam', city: ['Punalur', 'Kottarakkara', 'Karunagappally', 'Paravur', 'Kundara', 'Pathanapuram', 'Neendakara'] },
        { name: 'Pathanamthitta', city: ['Thiruvalla', 'Adoor', 'Konni', 'Pandalam', 'Aranmula'] },
        { name: 'Alapuzha', city: ['Chengannur', 'Cherthala', 'Haripad', 'Kayamkulam', 'Mavelikara'] },
        { name: 'Kottayam', city: ['Changanassery', 'Pala', 'Erattupetta', 'Ettumanoor', 'Vaikom'] },
        { name: 'Idukki', city: ['Kattappana ', 'Thodupuzha', 'Munnar'] },
        { name: 'Ernakulam', city: ['Kochi', 'Thripunithura', 'Aluva', 'Perumbavoor', 'Angamaly'] },
        { name: 'Thrissur', city: ['Chalakudy', 'Chavakkad', 'Guruvayoor', 'Kodungallur', 'Kunnamkulam'] },
        { name: 'Palakkad', city: ['Ottapalam', 'Shornur', 'Tattamangalam', 'Vadakkanchery', 'Mannarkkad', 'Pattambi'] },
        { name: 'Malapuram', city: ['Tirur', 'Manjeri', 'Kondotty', 'Nilambur', 'Karippur', 'Kottakkal'] },
        { name: 'Kozhikode', city: ['Feroke', 'Koyilandy', 'Vadakara', 'Koduvally'] },
        { name: 'Wayanad', city: ['Kalpetta', 'Mananthavady', 'Sulthan Bathery'] },
        { name: 'Kannur', city: ['Thalassery', 'Taliparamba', 'Payyanur', 'Iritty'] },
        { name: 'Kasaragod', city: ['Manjeshwar', 'Kanhangad', 'Nileshwaram', 'Uppala'] },
      ],
    },
    {
      name: 'Karnataka',
      cities: [
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Belagavi', neighborhoods: ['']},
        {name: 'Chamarajanagara', neighborhoods: ['']},
        {name: 'Chikkamagaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
        {name: 'Bengaluru', neighborhoods: ['']},
      ]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'year' || name === 'price' || name === 'kmDriven') {
      if (value === '' || parseInt(value) >= 0) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleFuelChange = (fuel) => {
    setFormData((prev) => ({ ...prev, fuel }));
    setError('');
  };

  const handleTransmissionChange = (transmission) => {
    setFormData((prev) => ({ ...prev, transmission }));
    setError('');
  };

  const handleNoOfOwnersChange = (noOfOwners) => {
    setFormData((prev) => ({ ...prev, noOfOwners }));
    setError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length <= 5) {
      const newImages = files.map((file) => file);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } else {
      setError('You can upload a maximum of 5 images.');
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setLocation({ state: value, district: '', city: '' });
    } else if (name === 'district') {
      setLocation((prev) => ({ ...prev, district: value, city: '' }));
    } else if (name === 'city') {
      setLocation((prev) => ({ ...prev, city: value }));
    }
    setError('');
  };

  const validateForm = () => {
    const requiredFields = [
      { key: 'brand', value: formData.brand },
      { key: 'carName', value: formData.carName },
      { key: 'year', value: formData.year },
      { key: 'fuel', value: formData.fuel },
      { key: 'transmission', value: formData.transmission },
      { key: 'noOfOwners', value: formData.noOfOwners },
      { key: 'adTitle', value: formData.adTitle },
      { key: 'description', value: formData.description },
      { key: 'price', value: formData.price },
      { key: 'kmDriven', value: formData.kmDriven },
      { key: 'state', value: location.state },
      { key: 'district', value: location.district },
      { key: 'city', value: location.city },
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        return `Please fill in the ${field.key} field.`;
      }
    }

    if (formData.images.length === 0) {
      return 'Please upload at least one image.';
    }

    if (isNaN(formData.kmDriven) || formData.kmDriven < 0) {
      return 'Please enter a valid number for Kilometers Driven.';
    }

    return '';
  };

  const handlePostAd = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          formDataToSend.append(key, value);
        }
      });
      const email = localStorage.getItem("email")
      formDataToSend.append('location[state]', location.state);
      formDataToSend.append('location[district]', location.district);
      formDataToSend.append('location[city]', location.city);
      formDataToSend.append("email",email)

      formData.images.forEach((image) => {
        formDataToSend.append('file', image);
      });

      console.log('Posting ad:', { ...formData, location });

      const response = await axios.post('http://localhost:3000/api/post', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response);
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      console.error('Error posting ad:', error.response || error.message);
      setError('Failed to post ad. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-white overflow-hidden">
        <div className="flex justify-center bg-white text-black p-4">
          <h1 className="text-xl font-bold uppercase">Post Your Ad</h1>
        </div>
        {error && (
          <div className="p-3">
            <div className="bg-red-100 text-red-700 text-sm rounded-md p-2">
              {error}
            </div>
          </div>
        )}
        <div className="p-6 space-y-6 border-1 border-gray-300">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 uppercase mb-3">Selected Category</h2>
            <div className="flex justify-between items-center p-3 rounded-md">
              <span className="text-sm text-gray-600">Cars / Cars</span>
              <span
                className="text-sm text-blue-800 font-bold hover:underline cursor-pointer"
                onClick={() => navigate('/sell')}
              >
                Change
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 uppercase mb-3">Include Some Details</h2>
            <div className="space-y-4 p-3 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                <div className="relative">
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 appearance-none"
                  >
                    <option value="">Select Brand</option>
                    {[
                      'Maruthi Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda', 'BYD', 'Audi',
                      'Ashok Leyland', 'Aston Martin', 'Bentley', 'Citroen', 'Tesla', 'BMW', 'Chevrolet',
                      'Datsun', 'Ferrari', 'Ford', 'Fiat', 'Force Motors', 'Isuzu', 'Jaguar', 'Jeep',
                      'Kia', 'Lexus', 'Lamborgini', 'Land Rover', 'Renault', 'Maybach', 'Mazda',
                      'Mercedez Benz', 'MG', 'Mini Cooper', 'Mistubishi', 'Nissan', 'Porsche',
                      'Rolls Royce', 'Skoda', 'Volkswagon', 'Volvo',
                    ].map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  <svg
                    className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
                <input
                  type="text"
                  name="carName"
                  value={formData.carName}
                  onChange={handleInputChange}
                  placeholder="Enter Car Model Name"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Year"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel *</label>
                <div className="flex flex-wrap gap-2">
                  {['Petrol', 'Diesel', 'Electric'].map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => handleFuelChange(fuel)}
                      className={`px-4 py-2 cursor-pointer border rounded-md text-sm font-medium ${
                        formData.fuel === fuel
                          ? 'bg-blue-200 text-black border-black'
                          : 'border-gray-300 text-black'
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
                <div className="flex gap-2">
                  {['Automatic', 'Manual'].map((transmission) => (
                    <button
                      key={transmission}
                      onClick={() => handleTransmissionChange(transmission)}
                      className={`px-4 py-2 cursor-pointer border rounded-md text-sm font-medium ${
                        formData.transmission === transmission
                          ? 'bg-blue-200 text-black border-black'
                          : 'border-gray-300 text-black'
                      }`}
                    >
                      {transmission}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KM driven *</label>
                <input
                  type="number"
                  name="kmDriven"
                  value={formData.kmDriven}
                  onChange={handleInputChange}
                  placeholder="kilometer"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Owners *</label>
                <div className="flex gap-2">
                  {['1st', '2nd', '3rd', '4th', '4+'].map((noOfOwners) => (
                    <button
                      key={noOfOwners}
                      onClick={() => handleNoOfOwnersChange(noOfOwners)}
                      className={`px-4 py-2 cursor-pointer border rounded-md text-sm font-medium ${
                        formData.noOfOwners === noOfOwners
                          ? 'bg-blue-200 text-black border-black'
                          : 'border-gray-300 text-black'
                      }`}
                    >
                      {noOfOwners}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title *</label>
                <input
                  type="text"
                  name="adTitle"
                  value={formData.adTitle}
                  onChange={handleInputChange}
                  placeholder="Enter Ad Title"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter Description"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
                  rows="4"
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Price</h2>
            <div className="p-3 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="₹ Enter Price"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
              />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 uppercase mb-3">Upload Photos</h2>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {Array(5).fill(null).map((_, index) => (
                  <div key={index} className="relative">
                    {imagePreviews[index] ? (
                      <div>
                        <img
                          src={imagePreviews[index]}
                          alt={`Uploaded ${index + 1}`}
                          className="w-24 h-24 object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 cursor-pointer rounded-[30px] p-1 text-white text-xs hover:bg-opacity-75"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 cursor-pointer hover:bg-gray-100">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={formData.images.length >= 5}
                        />
                        <span className="text-2xl text-gray-400">
                          <svg width="36px" height="36px" viewBox="0 0 1024 1024" data-aut-id="icon" className="" fillRule="evenodd">
                            <path
                              className="rui-i1ika"
                              d="M861.099 667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515 124.16l38.784 116.437h165.973l38.827 38.827v271.659l-38.827 38.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784 116.48h-183.083v426.923h426.667l38.784 38.357-38.784 39.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216 318.208c106.837 0 193.92 86.955 193.92 194.048 0 106.923-87.040 194.091-193.92 194.091s-193.963-87.168-193.963-194.091c0-107.093 87.083-194.048 193.963-194.048zM473.216 395.861c-64.213 0-116.352 52.181-116.352 116.395 0 64.256 52.139 116.437 116.352 116.437 64.171 0 116.352-52.181 116.352-116.437 0-64.213-52.181-116.437-116.352-116.437z"
                            ></path>
                          </svg>
                        </span>
                        {index === 0 && (
                          <span className="text-xs text-gray-600 text-center mt-1">Add Photos</span>
                        )}
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 uppercase mb-3">Confirm Your Location</h2>
            <div className="space-y-4 p-3 bg-gray-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <div className="relative">
                  <select
                    name="state"
                    value={location.state}
                    onChange={handleLocationChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 appearance-none"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.name} value={state.name}>{state.name}</option>
                    ))}
                  </select>
                  <svg
                    className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {location.state && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                  <div className="relative">
                    <select
                      name="district"
                      value={location.district}
                      onChange={handleLocationChange}
                      className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 appearance-none"
                    >
                      <option value="">Select District</option>
                      {states
                        .find((s) => s.name === location.state)
                        ?.cities.map((city) => (
                          <option key={city.name} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                    <svg
                      className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
              {location.district && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <div className="relative">
                    <select
                      name="city"
                      value={location.city}
                      onChange={handleLocationChange}
                      className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 appearance-none"
                    >
                      <option value="">Select City</option>city
                      {states
                        .find((s) => s.name === location.state)
                        ?.cities.find((c) => c.name === location.district)
                        ?.city.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    <svg
                      className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-3">
            <button
              onClick={handlePostAd}
              className="w-full py-3 bg-blue-700 text-white text-sm font-semibold rounded-md cursor-pointer focus:outline-none focus:ring-2 transition-colors"
            >
              Post Your Ad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Car;



















































// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from "axios"

// const Car = () => {
//   const [formData, setFormData] = useState({
//     brand: '',
//     carName: '',
//     year: '',
//     fuel: '',
//     transmission: '',
//     kmDriven: '',
//     noOfOwners: '',
//     adTitle: '',
//     description: '',
//     images: [],
//     price: '',
//   });
//   const [images, setImages] = useState(Array(5).fill(null));
//   const [location, setLocation] = useState({
//     state: '',
//     district: '',
//     city: '',
//   });

//   const navigate = useNavigate();

//   const states = [
//     {
//       name: 'Kerala',
//       cities: [
//         { name: 'Thiruvananthapuram', neighborhoods: ['Neyyatinkara', 'Nedumangad', 'Attingal', 'Varkala'] },
//         { name: 'Kollam', neighborhoods: ['Punalur', 'Kottarakkara', 'Karunagappally', 'Paravur', 'Kundara', 'Pathanapuram', 'Neendakara'] },
//         { name: 'Pathanamthitta', neighborhoods: ['Thiruvalla', 'Adoor', 'Konni', 'Pandalam', 'Aranmula'] },
//         { name: 'Alapuzha', neighborhoods: ['Chengannur', 'Cherthala', 'Haripad', 'Kayamkulam', 'Mavelikara'] },
//         { name: 'Kottayam', neighborhoods: ['Changanassery', 'Pala', 'Erattupetta', 'Ettumanoor', 'Vaikom'] },
//         { name: 'Idukki', neighborhoods: ['Kattappana ', 'Thodupuzha', 'Munnar'] },
//         { name: 'Ernakulam', neighborhoods: ['Kochi', 'Thripunithura', 'Aluva', 'Perumbavoor', 'Angamaly'] },
//         { name: 'Thrissur', neighborhoods: ['Chalakudy', 'Chavakkad', 'Guruvayoor', 'Kodungallur', 'Kunnamkulam'] },
//         { name: 'Palakkad', neighborhoods: ['Ottapalam', 'Shornur', 'Tattamangalam', 'Vadakkanchery', 'Mannarkkad', 'Pattambi'] },
//         { name: 'Malapuram', neighborhoods: ['Tirur', 'Manjeri', 'Kondotty', 'Nilambur', 'Karippur', 'Kottakkal'] },
//         { name: 'Kozhikode', neighborhoods: ['Feroke', 'Koyilandy', 'Vadakara', 'Koduvally'] },
//         { name: 'Wayanad', neighborhoods: ['Kalpetta', 'Mananthavady', 'Sulthan Bathery'] },
//         { name: 'Kannur', neighborhoods: ['Thalassery', 'Taliparamba', 'Payyanur', 'Iritty'] },
//         { name: 'Kasaragod', neighborhoods: ['Manjeshwar', 'Kanhangad', 'Nileshwaram', 'Uppala'] },
//       ],
//     },
//   ];
  
//    const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'year' || name === 'price' || name === 'kmDriven') {
//       if (value === '' || parseInt(value) >= 0) {
//         setFormData((prev) => ({ ...prev, [name]: value }));
//       }
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleFuelChange = (fuel) => {
//     setFormData((prev) => ({ ...prev, fuel }));
//   };

//   const handleTransmissionChange = (transmission) => {
//     setFormData((prev) => ({ ...prev, transmission }));
//   };

//   const handleYearChange = (noOfOwner) => {
//     setFormData((prev) => ({ ...prev, noOfOwner }));
//   };

//   const handleImageChange = (index, e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setImages((prev) => {
//         const newImages = [...prev];
//         newImages[index] = imageUrl;
//         return newImages;
//       });
//     }
//   };

//   const removeImage = (index) => {
//     setImages((prev) => {
//       const newImages = [...prev];
//       newImages[index] = null;
//       return newImages;
//     });
//   };

//   const handleLocationChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'state') {
//       setLocation({ state: value, city: '', neighborhood: '' });
//     } else if (name === 'city') {
//       setLocation((prev) => ({ ...prev, city: value, neighborhood: '' }));
//     } else {
//       setLocation((prev) => ({ ...prev, neighborhood: value }));
//     }
//   };

//   const handlePostAd = async() => {
//     console.log('Posting ad:', formData, images.filter((img) => img !== null), location);

//     const response = await axios.post(`http:localhost:3000/api/post`,{formData})

//   };

//   return (
//     <div className="min-h-screen bg-white flex justify-center p-4 sm:p-6 font-sans">
//       <div className="w-full max-w-2xl bg-white overflow-hidden">
//         <div className="flex justify-center bg-white text-black p-4">
//           {/* <button onClick={() => navigate(-1)} className="mr-3 focus:outline-none">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//             </svg>
//           </button> */}
//           <h1 className="text-xl font-bold uppercase">Post Your Ad</h1>
//         </div>

//         <div className="p-6 space-y-6 border-1 border-gray-300">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900 uppercase mb-3">Selected Category</h2>
//             <div className="flex justify-between items-center p-3 rounded-md">
//               <span className="text-sm text-gray-600">Cars / Cars</span>
//               <a href="#" className="text-sm text-blue-800 font-bold hover:underline">
//                 Change
//               </a>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-semibold text-gray-900 uppercase mb-3">Include Some Details</h2>
//             <div className="space-y-4 p-3 rounded-md">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
//                 <div className="relative">
//                   <select
//                     name="brand"
//                     value={formData.brand}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 appearance-none"
//                   >
//                     <option value="">Select Brand</option>
//                     <option value="Maruthi Suzuki">Maruthi Suzuki</option>
//                     <option value="Hyundai">Hyundai</option>
//                     <option value="Tata">Tata</option>
//                     <option value="Mahindra">Mahindra</option>
//                     <option value="Toyota">Toyota</option>
//                     <option value="Honda">Honda</option>
//                     <option value="BYD">BYD</option>
//                     <option value="Audi">Audi</option>
//                     <option value="Ashok Leyland">Ashok Leyland</option>
//                     <option value="Aston Martin">Aston Martin</option>
//                     <option value="Bentley">Bentley</option>
//                     <option value="Citroen">Citroen</option>
//                     <option value="Tesla">Tesla</option>
//                     <option value="BMW">BMW</option>
//                     <option value="Chevrolet">Chevrolet</option>
//                     <option value="Datsun">Datsun</option>
//                     <option value="Ferrari">Ferrari</option>
//                     <option value="Ford">Ford</option>
//                     <option value="Fiat">Fiat</option>
//                     <option value="Force Motors">Force Motors</option>
//                     <option value="Isuzu">Isuzu</option>
//                     <option value="Jaguar">Jaguar</option>
//                     <option value="Jeep">Jeep</option>
//                     <option value="Kia">Kia</option>
//                     <option value="Lexus">Lexus</option>
//                     <option value="Lamborgini">Lamborgini</option>
//                     <option value="Land Rover">Land Rover</option>
//                     <option value="Renault">Renault</option>
//                     <option value="Maybach">Maybach</option>
//                     <option value="Mazda">Mazda</option>
//                     <option value="Mercedez Benz">Mercedez Benz</option>
//                     <option value="MG">MG</option>
//                     <option value="Mini Cooper">Mini Cooper</option>
//                     <option value="Mistubishi">Mistubishi</option>
//                     <option value="Nissan">Nissan</option>
//                     <option value="Porsche">Porsche</option>
//                     <option value="Rolls Royce">Rolls Royce</option>
//                     <option value="Skoda">Skoda</option>
//                     <option value="Volkswagon">Volkswagon</option>
//                     <option value="Volvo">Volvo</option>
//                   </select>
//                   <svg
//                     className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
//                 <input
//                   type="text"
//                   name="carName"
//                   value={formData.carName}
//                   onChange={handleInputChange}
//                   placeholder="Enter Car Model Name"
//                   className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
//                 <input
//                   type="number"
//                   name="year"
//                   value={formData.year}
//                   onChange={handleInputChange}
//                   placeholder="Year"
//                   min='0'
//                   className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Fuel *</label>
//                 <div className="flex flex-wrap gap-2">
//                   {[ 'Petrol', 'Diesel', 'Electric'].map((fuel) => (
//                     <button
//                       key={fuel}
//                       onClick={() => handleFuelChange(fuel)}
//                       className={`px-4 py-2 cursor-pointer border rounded-md text-sm font-medium ${
//                         formData.fuel === fuel
//                           ? 'bg-blue-200 text-black border-black'
//                           : 'border-gray-300 text-black'
//                       }`}
//                     >
//                       {fuel}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
//                 <div className="flex gap-2">
//                   {['Automatic', 'Manual'].map((transmission) => (
//                     <button
//                       key={transmission}
//                       onClick={() => handleTransmissionChange(transmission)}
//                       className={`px-4 py-2 cursor-pointer border rounded-md text-sm font-medium ${
//                         formData.transmission === transmission
//                           ? 'bg-blue-200 text-black border-black'
//                           : 'border-gray-300 text-black '
//                       }`}
//                     >
//                       {transmission}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">KM driven *</label>
//                 <input
//                   type="number"
//                   name="kmDriven"
//                   value={formData.kmDriven}
//                   onChange={handleInputChange}
//                   placeholder="kilometer"
//                   min='0'
//                   className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Number of Owners *</label>
//                 <div className="flex gap-2">
//                   {['1st','2nd','3rd','4th','4+'].map((noOfOwner) => (
//                     <button
//                       key={noOfOwner}
//                       onClick={() => handleYearChange(noOfOwner)}
//                       className={`px-4 py-2 cursor-pointer border rounded-md text-sm font-medium ${
//                         formData.noOfOwner === noOfOwner
//                           ? 'bg-blue-200 text-black border-black'
//                           : 'border-gray-300 text-black'
//                       }`}
//                     >
//                       {noOfOwner}
//                     </button>
//                   ))}
//                 </div>

//                 {/* <input
//                   type="number"
//                   name="noOfOwners"
//                   value={formData.noOfOwners}
//                   onChange={handleInputChange}
//                   placeholder="Enter Number of Owners"
//                   className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
//                 /> */}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title *</label>
//                 <input
//                   type="text"
//                   name="adTitle"
//                   value={formData.adTitle}
//                   onChange={handleInputChange}
//                   placeholder="Enter Ad Title"
//                   className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   placeholder="Enter Description"
//                   className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
//                   rows="4"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-semibold text-gray-900 mb-3">Price</h2>
//             <div className="p-3 bg-gray-50 rounded-md">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 placeholder="₹ Enter Price"
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
//               />
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-semibold text-gray-900 uppercase mb-3">Upload Photos</h2>
//             <div className="p-3 bg-gray-50 rounded-md">
//               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
//                 {images.map((image, index) => (
//                   <div key={index} className="relative">
//                     {image ? (
//                       <div>
//                         <img
//                           src={image}
//                           alt={`Uploaded ${index + 1}`}
//                           className="w-24 h-24 object-cover"
//                         />
//                         <button
//                           onClick={() => removeImage(index)}
//                           className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 cursor-pointer rounded-[30px] p-1 text-white text-xs hover:bg-opacity-75"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ) : (
//                       <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 cursor-pointer hover:bg-gray-100">
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => handleImageChange(index, e)}
//                           className="hidden"
//                         />
//                         <span className="text-2xl text-gray-400"><svg width="36px" height="36px" viewBox="0 0 1024 1024" data-aut-id="icon" class="" fill-rule="evenodd"><path class="rui-i1ika" d="M861.099 667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515 124.16l38.784 116.437h165.973l38.827 38.827v271.659l-38.827 38.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784 116.48h-183.083v426.923h426.667l38.784 38.357-38.784 39.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216 318.208c106.837 0 193.92 86.955 193.92 194.048 0 106.923-87.040 194.091-193.92 194.091s-193.963-87.168-193.963-194.091c0-107.093 87.083-194.048 193.963-194.048zM473.216 395.861c-64.213 0-116.352 52.181-116.352 116.395 0 64.256 52.139 116.437 116.352 116.437 64.171 0 116.352-52.181 116.352-116.437 0-64.213-52.181-116.437-116.352-116.437z"></path></svg></span>
//                         {index === 0 && (
//                           <span className="text-xs text-gray-600 text-center mt-1">Add Photos</span>
//                         )}
//                       </label>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-semibold text-gray-900 uppercase mb-3">Confirm Your Location</h2>
//             <div className="space-y-4 p-3 bg-gray-50 rounded-md">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
//                 <div className="relative">
//                   <select
//                     name="state"
//                     value={location.state}
//                     onChange={handleLocationChange}
//                     className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 appearance-none"
//                   >
//                     <option value="">Select State</option>
//                     {states.map((state) => (
//                       <option key={state.name} value={state.name}>
//                         {state.name}
//                       </option>
//                     ))}
//                   </select>
//                   <svg
//                     className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>
              
//               {location.state && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
//                   <div className="relative">
//                     <select
//                       name="city"
//                       value={location.city}
//                       onChange={handleLocationChange}
//                       className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 appearance-none"
//                     >
//                       <option value="">Select City</option>
//                       {states
//                         .find((s) => s.name === location.state)
//                         ?.cities.map((city) => (
//                           <option key={city.name} value={city.name}>
//                             {city.name}
//                           </option>
//                         ))}
//                     </select>
//                     <svg
//                       className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               )}

//               {location.city && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
//                   <div className="relative">
//                     <select
//                       name="neighborhood"
//                       value={location.neighborhood}
//                       onChange={handleLocationChange}
//                       className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 appearance-none"
//                     >
//                       <option value="">Select Neighborhood</option>
//                       {states
//                         .find((s) => s.name === location.state)
//                         ?.cities.find((c) => c.name === location.city)
//                         ?.neighborhoods.map((neighborhood) => (
//                           <option key={neighborhood} value={neighborhood}>
//                             {neighborhood}
//                           </option>
//                         ))}
//                     </select>
//                     <svg
//                       className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="p-3">
//             <button
//               onClick={handlePostAd}
//               className="w-full py-3 bg-blue-700 text-white text-sm font-semibold rounded-md cursor-pointer focus:outline-none focus:ring-2 transition-colors"
//             >
//               Post Your Ad
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Car;











