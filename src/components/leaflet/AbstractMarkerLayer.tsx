// import { renderToStaticMarkup } from 'react-dom/server';
import Leaflet from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import 'twin.macro';

interface MarkerProps {
  center: LatLngTuple;
  popupContent: string;
  id: string;
  icon: string;
}
interface AbstractMarkerLayerProps {
  zoom: number;
  markers: MarkerProps[];
}

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const AbstractMarkerLayer: React.VFC<AbstractMarkerLayerProps> = ({
  zoom,
  markers,
}: AbstractMarkerLayerProps) => {
  const [center, setCenter] = useState([35.68945, 139.691774]);
  useEffect(() => {
    delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
    Leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);
  useEffect(() => {
    if (markers && markers.length > 0) {
      setCenter(markers[0].center);
    }
  }, [markers]);
  return (
    <div className='map' tw='h-full mx-auto m-0 p-0'>
      <MapContainer
        center={center as LatLngTuple}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <ChangeView center={center} zoom={zoom} />
        {markers.map((marker) => {
          /*
          const iconMarkup = renderToStaticMarkup(
            <div style={{ width: 30, height: 30 }}>
              <img src={marker.icon} width={30} height={30} />
            </div>
          );
          const markerIcon = new Leaflet.DivIcon({
            html: iconMarkup,
            className: '',
          });
          */
          return (
            <Marker key={marker.id} position={marker.center}>
              <Popup>{marker.popupContent}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AbstractMarkerLayer;
