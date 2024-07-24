import React, { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const user = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('searchTerm');
    if (searchTerm) {
      setSearchTerm(searchTerm);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">Real</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          ></input>
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/"> Home</Link>
          </li>
          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/about">About</Link>
          </li>
          <li className=" text-slate-700 hover:underline">
            {user.currentUser ? (
              <Link to="/profile">
                <img src={user?.currentUser?.avatar} alt="Profile" className="rounded-full h-7 w-7 object-cover"></img>
              </Link>
            ) : (
              <Link to="/sign-in">Sign In</Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
