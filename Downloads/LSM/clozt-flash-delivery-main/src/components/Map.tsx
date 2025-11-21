import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useMemo } from 'react';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  center: [number, number];
  marker?: [number, number];
  route?: [number, number][];
  height?: string;
}

export default function Map({ center, marker, route, height = '500px' }: MapProps) {
  const tileUrl = useMemo(() => {
    const key = import.meta.env.VITE_MAPTILER_KEY as string | undefined;
    return key
      ? `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${key}`
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  }, []);

  return (
    <div style={{ height }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={tileUrl} />
        {marker && <Marker position={marker} icon={defaultIcon} />}
        {route && route.length > 1 && (
          <Polyline positions={route} pathOptions={{ color: '#6C47FF', weight: 4 }} />
        )}
      </MapContainer>
    </div>
  );
}