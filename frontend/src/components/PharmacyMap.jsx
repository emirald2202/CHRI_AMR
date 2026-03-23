import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Crucial: Leaflet requires Webpack/Vite to re-bind the default marker icons for production bundles
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const cityCoordinates = {
  "Mumbai": [19.0760, 72.8777],
  "Delhi": [28.7041, 77.1025],
  "Bengaluru": [12.9716, 77.5946],
  "Hyderabad": [17.3850, 78.4867],
  "Chennai": [13.0827, 80.2707],
  "Kolkata": [22.5726, 88.3639],
  "Pune": [18.5204, 73.8567],
  "Ahmedabad": [23.0225, 72.5714],
  "Jaipur": [26.9124, 75.7873],
  "Surat": [21.1702, 72.8311],
  "Lucknow": [26.8467, 80.9462],
  "Kanpur": [26.4499, 80.3319],
  "Nagpur": [21.1458, 79.0882],
  "Indore": [22.7196, 75.8577],
  "Bhopal": [23.2599, 77.4126]
};

const MapUpdater = ({ focusRegion }) => {
  const map = useMap();
  React.useEffect(() => {
    if (focusRegion) {
      map.flyTo(focusRegion, 15, { animate: true, duration: 1.5 });
    }
  }, [focusRegion, map]);
  return null;
};

const PharmacyMap = ({ pharmacies, onPharmacyClick, userCity, focusRegion }) => {
  // Center tightly on the User's registered City
  const uCityName = userCity ? userCity.split(',').pop().trim() : '';
  const center = cityCoordinates[uCityName] || [18.5204, 73.8567];

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
      <MapUpdater focusRegion={focusRegion} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pharmacies.map(p => {
         if (!p.coordinates || !p.coordinates.lat) return null;
         return (
             <Marker key={p._id} position={[p.coordinates.lat, p.coordinates.lng]}>
               <Popup>
                 <div className="font-sans min-w-[150px]">
                    <h3 className="font-extrabold text-sm text-gray-800 m-0">{p.pharmacyName || p.name}</h3>
                    <p className="text-[0.65rem] text-gray-500 mb-2 mt-0.5 leading-tight">{p.address ? `${p.address.street}, ${p.address.city}` : 'No address specified'}</p>
                    <button 
                       onClick={(e) => {
                          e.stopPropagation();
                          onPharmacyClick(p);
                       }}
                       className="bg-[#059669] text-white font-bold text-xs px-3 py-2 rounded-lg shadow-[0_2px_8px_rgba(5,150,105,0.4)] hover:bg-[#047857] w-full transition-colors border-0 cursor-pointer"
                    >
                       Schedule Here
                    </button>
                 </div>
               </Popup>
             </Marker>
         );
      })}
    </MapContainer>
  );
};

export default PharmacyMap;
