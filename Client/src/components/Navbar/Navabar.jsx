import './Navbar.css'
import logo from '../../assets/logo.svg';
import search from '../../assets/search1.svg';
import arrow from '../../assets/arrow-down.svg';
import searchWt from '../../assets/search.svg';
import addBtn from '../../assets/addButton.png';
import like from '../../assets/like.svg';
import message from '../../assets/message.svg';

const Navbar = (props) => {
    const { toggleModal, toggleModalSell } = props

    return (
        <div>
            <nav className="fixed z-50 w-full overflow-auto p-2 pl-3 pr-3 shadow-md bg-slate-100 border-b-4 border-solid border-b-white">
                <img src={logo} alt="" className='w-12' />
                <div className='relative location-search ml-5'>
                    <img src={search} alt="" className='absolute top-4 left-2 w-5' />
                    <input 
                        placeholder='Search city, area, or locality...' 
                        className='w-[50px] sm:w-[150px] md:w-[250] lg:w-[270px] p-3 pl-8 pr-8 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300' 
                        type="text" 
                    />
                    <img src={arrow} alt="" className='absolute top-4 right-3 w-5 cursor-pointer' />
                </div>

{/* Search bar */}
                <div className="ml-5 mr-2 relative w-full main-search">
                    <input 
                        placeholder='Find Cars, Mobile Phones, and More...' 
                        className='w-full p-3 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300' 
                        type="text" 
                    />
                    <div style={{ backgroundColor: '#002f34' }} className="flex justify-center items-center absolute top-0 right-0 h-full rounded-e-md w-12 cursor-pointer">
                        <img className="w-5 filter invert cursor-pointer" src={searchWt} alt="Search Icon" />
                    </div>
                </div>

{/* Language field */}
                <div className="mx-1 sm:ml-5 sm:mr-5 relative">
                    <p className="font-semibold mr-3">English</p>
                    <img src={arrow} alt="" className='w-5 cursor-pointer' />
                </div>


{/* Like Button */}
                <div className='mx-1 sm:ml-5 sm:mr-5 relative'>
                    <img src={like} alt="" className='w-10 cursor-pointer' />
                </div> 

{/* Message Button */}
                <div>
                    <img src={message} alt="" className='w-10 cursor-pointer' />
                </div>

{/* Login Button */}
                <p className='font-bold underline ml-5 cursor-pointer' style={{ color: '#002f34' }}>Login</p>

{/* Add Button */}
                <img 
                    src={addBtn} 
                    onClick={toggleModalSell}
                    className='w-24 mx-1 sm:ml-5 sm:mr-5 shadow-xl rounded-full cursor-pointer'
                    alt="" 
                />
            </nav>

{/* Categories */}
            <div className='w-full relative z-0 flex shadow-md p-2 pt-20 pl-10 pr-10 sm:pl-44 md:pr-44 sub-lists'>
                <ul className='list-none flex items-center justify-center w-full'>
                    <div className='flex flex-shrink-0'>
                        <p className='font-semibold uppercase all-cats cursor-pointer'>All categories</p>
                        <img className='w-4 ml-2 cursor-pointer' src={arrow} alt="" />
                    </div>

{/* Nav-bar description section */}
                    <li>Vehicles</li>
                    <li>Electronics</li>
                    {/* <li>Mobile Phones</li> */}
                    {/* <li>For sale: Houses & Apartments</li> */}
                    {/* <li>Scooter</li> */}
                    {/* <li>Commercial & Other Vehicles</li> */}
                    {/* <li>For rent: Houses & Apartments</li> */}
                </ul>
            </div>
        </div>
    )
}

export default Navbar;