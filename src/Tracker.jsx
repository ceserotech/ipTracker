// App.jsx
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";



import arrowIcon from "/images/icon-arrow.svg";
import patternDesktop from "/images/pattern-bg-desktop.png";
import patternMobile from "/images/pattern-bg-mobile.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// FIX LEAFLET ICON ISSUE
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ChangeMapView({ coords }) {
  const map = useMap();

  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);

  return null;
}

export default function Tracker() {
  const [query, setQuery] = useState("");
  const [ipData, setIpData] = useState(null);
  const [coords, setCoords] = useState([51.505, -0.09]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "at_PNpVeRRN057css50qFYS01LRQdGf2";

  const fetchIP = async (value = "") => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${value}`,
      );

      const data = await res.json();

      setIpData(data);

      setCoords([data.location.lat, data.location.lng]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIP();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    fetchIP(query);
    setQuery("");
  };

  return (
    <main className="h-screen flex flex-col">
      {/* TOP SEc */}
      <section
        className="h-[300px] bg-cover bg-center px-6 pt-8 relative z-[1000]"
        style={{
          backgroundImage: `url(${
            window.innerWidth >= 768 ? patternDesktop : patternMobile
          })`,
        }}
      >
        <h1 className="text-white text-center text-2xl md:text-3xl font-bold">
          IP Address Tracker
        </h1>

        {/* SEARCH */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-8 flex">
          <input
            type="text"
            placeholder="Search for any IP address or domain"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-5 py-4 rounded-l-2xl outline-1 bg-white text-[18px]"
          />

          <button className="bg-black px-6 rounded-r-2xl hover:bg-gray-800 transition">
            <img src={arrowIcon} alt="arrow" />
          </button>
        </form>

        {/* INFO CARD */}
        <div className="bg-white rounded-2xl mt-8 max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 shadow-xl relative z-[1000]">
          <InfoBox
            title="IP ADDRESS"
            value={loading ? "Loading..." : ipData?.ip}
          />

          <InfoBox
            title="LOCATION"
            value={
              loading
                ? "Loading..."
                : `${ipData?.location?.city || ""}, ${
                    ipData?.location?.country || ""
                  }`
            }
          />

          <InfoBox
            title="TIMEZONE"
            value={
              loading ? "Loading..." : `UTC ${ipData?.location?.timezone || ""}`
            }
          />

          <InfoBox title="ISP" value={loading ? "Loading..." : ipData?.isp} />
        </div>
      </section>

      {/* MAP */}
      <section className="flex-1 z-0">
        <MapContainer
          center={coords}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={coords}>
            <Popup>Your searched location</Popup>
          </Marker>

          <ChangeMapView coords={coords} />
        </MapContainer>
      </section>
    </main>
  );
}

function InfoBox({ title, value }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-gray-400 text-xs tracking-[2px] font-bold">{title}</p>

      <h2 className="mt-3 text-xl md:text-2xl font-bold break-words">
        {value}
      </h2>
    </div>
  );
}
