import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Cars",
    icon: (
      <svg width="24" height="24" viewBox="0 0 1024 1024" fill="currentColor">
        <path d="M744.747 124.16l38.4 33.28 36.949 258.731 107.221 107.179 11.349 27.435v193.963l-38.827 38.784h-38.741v116.352h-77.568v-116.352h-543.061v116.352h-77.568v-116.352h-38.741l-38.827-38.827v-193.877l11.349-27.435 107.264-107.221 36.949-258.731 38.4-33.28h465.493zM768.555 474.325h-513.109l-92.544 92.501v139.093h698.197v-139.093l-92.544-92.501zM298.667 550.784c32.128 0 58.197 26.027 58.197 58.197 0 32.128-26.027 58.155-58.197 58.155-32.128 0-58.197-26.027-58.197-58.155s26.027-58.197 58.197-58.197zM725.333 550.784c32.128 0 58.197 26.027 58.197 58.197 0 32.128-26.027 58.155-58.197 58.155-32.128 0-58.197-26.027-58.197-58.155s26.027-58.197 58.197-58.197zM711.083 201.685h-398.165l-27.904 195.115h453.888l-27.861-195.072z" />
      </svg>
    ),
    subcategories: ["Cars"],
    route: "/post/car",
  },
  {
    name: "Bikes",
    icon: (
      <svg width="24" height="24" viewBox="0 0 1024 1024" fill="currentColor">
        <path d="M674.657 245.333l47.813 129.715 23.448-51.706h51.11l26.563 33.51v80.171h-78.406l26.746 72.064h9.892c75.576 0 136.843 60.253 136.843 134.579s-61.267 134.579-136.843 134.579c-59.691-0.227-112.346-38.479-130.112-94.523s3.455-116.947 52.44-150.495v0l2.931-1.982-28.578-78.189-77.49 225.74h-167.070v3.243c-19.579 65.476-85.893 106.172-154.3 94.693s-117.248-71.498-113.643-139.654c3.605-68.156 58.515-122.867 127.764-127.303s130.911 42.808 143.476 109.928v0 3.783h122.554l22.716-66.839h-121.455l-61.735-80.171h-197.662l-58.071 132.598-36.638 9.008-21.616-28.826 69.796-168.089h228.255l64.849-62.696h196.197l-16.304-44.319h-89.763v-68.821h136.294zM796.845 577.368l25.463 69.362-20.884 31.888-43.233-6.306-26.746-75.307-5.129 6.846v0.54c-17.559 23.523-17.878 55.449-0.79 79.306s47.76 34.314 76.196 25.976c28.435-8.338 48.277-33.608 49.289-62.772s-17.032-55.706-44.823-65.931v0l-9.343-3.603zM365.248 616.823c-12.157-27.922-41.767-44.432-72.372-40.354s-54.681 27.74-58.847 57.836c-4.166 30.096 12.603 59.227 40.986 71.201s61.403 3.848 80.707-19.861v0l5.862-7.387-85 0.18v-57.111l29.86-18.016 30.41 19.818h31.142zM627.943 413.233h-153.88l-31.142 33.568 32.791 46.432h128.233l23.998-80zM318.667 345.333v66.667h-133.333v-66.667h133.333z" />
      </svg>
    ),
    subcategories: ["Bikes"],
    route: "/post/bikes",
  },
  {
    name: "Electronics",
    icon: (
      <svg width="24" height="24" viewBox="0 0 1024 1024" fill="currentColor">
        <path d="M149.76 128l-64.427 62.848v480.853l69.333 67.84h317.781l0.725 75.477h-169.6v80.981h416.128v-80.981h-161.621l-0.683-75.435h315.648l65.621-68.693v-482.389l-75.733-60.501h-713.173zM170.24 638.72v-414.848l15.232-14.848h646.656l21.632 17.28v413.184l-18.176 19.072h-645.12l-20.224-19.84z" />
      </svg>
    ),
    subcategories: ["Mobiles", "Laptops", "Cameras"],
    route: {
      Mobiles: "/post/mobiles",
      Laptops: "/post/laptop",
      Cameras: "/post/camera",
    },
  },
];

const Sell = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubcategoryClick = (subcategory) => {
    const route = typeof selectedCategory.route === "object" ? selectedCategory.route[subcategory] : selectedCategory.route;
    navigate(route);
  };

  return (
    <div className="min-h-156 bg-white flex items-center justify-center border-1 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg border-1 border-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 p-4 text-center">Post Your Ad</h2>
        <div className="p-4 border-t border-gray-200 border-1 border-gray-300">
          <h3 className="text-sm font-semibold text-gray-700 uppercase">Choose a Category</h3>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-white border-1 border-gray-200">
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                  selectedCategory?.name === category.name ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {category.icon}
                  <span className="text-sm font-medium text-gray-800">{category.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </div>
            ))}
          </div>
          <div className="w-full md:w-2/3 p-4">
            {selectedCategory ? (
              selectedCategory.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubcategoryClick(sub)}
                  className="w-full text-left p-2 mb-2 bg-gray-50 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  {sub}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">Select a category to continue</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;