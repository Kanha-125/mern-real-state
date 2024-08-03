import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItems from '../components/ListingItems.jsx';

const SearchPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [listings, setListings] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = React.useState({
    searchTerm: '',
    parking: false,
    type: 'all',
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const parkingFromUrl = urlParams.get('parking');
    const typeFromUrl = urlParams.get('type');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const orderFromUrl = urlParams.get('order');
    const sortFromUrl = urlParams.get('sort');

    if (
      searchTermFromUrl ||
      parkingFromUrl ||
      typeFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        parking: parkingFromUrl === 'true' || false,
        type: typeFromUrl || 'all',
        furnished: furnishedFromUrl === 'true' || false,
        offer: offerFromUrl === 'true' || false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchData = async () => {
      setShowMore(false);
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await response.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [window.location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'sale' || e.target.id === 'rent') {
      setSidebarData({ ...sidebarData, type: e.target.id });
    } else if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    } else if (e.target.id === 'furnished' || e.target.id === 'offer' || e.target.id === 'parking') {
      setSidebarData({ ...sidebarData, [e.target.id]: !sidebarData[e.target.id] });
    } else if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('type', sidebarData.type);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    const searchQuery = urlParams.toString();

    const response = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await response.json();
    if (data.length < 8) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
    setListings([...listings, ...data]);
  };

  const onShowMoreClick = async () => {
    const noOFListings = listings.length;
    const startIndex = noOFListings;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term : </label>
            <input
              value={sidebarData.searchTerm}
              onChange={handleChange}
              type="text"
              className="border rounded-lg p-3 w-full"
              id="searchTerm"
              placeholder="Search"
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type : </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === 'all'}
              />
              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === 'rent'}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === 'sale'}
              />
              <span>Sale</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={sidebarData.offer} />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities : </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parkig}
              />
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort : </label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
              defaultValue={'created_at_desc'}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing results :</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && !error && listings.length == 0 && (
            <p className="text-xl text-center text-slate-700">No listings found.</p>
          )}
          {error && <p className="text-xl text-center text-red-700">error while searching listings</p>}
          {loading && <p className="text-xl text-center text-slate-700 w-full">Loading...</p>}
          {!loading && listings && listings.map((listing, index) => <ListingItems key={index} listing={listing} />)}
          {showMore && (
            <button onClick={onShowMoreClick} className="text-green-700 hover:underline p-7 text-center w-full">
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
