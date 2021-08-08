import { LatLngTuple } from 'leaflet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Leaflet from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'twin.macro';

const DraggableMarker = ({
  center,
  dragend,
}: {
  center: LatLngTuple;
  dragend: (LatLngTuple) => void;
}) => {
  const [position, setPosition] = useState(center);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          dragend(marker.getLatLng());
        }
      },
    }),
    []
  );

  useEffect(() => {
    setPosition(center);
  }, [center]);

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
};

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const StaticMap: React.VFC<{
  center: LatLngTuple;
  zoom: number;
  dragend: (LatLngTuple) => void;
}> = ({
  center,
  zoom,
  dragend,
}: {
  center: LatLngTuple;
  zoom: number;
  dragend: (LatLngTuple) => void;
}) => {
  useEffect(() => {
    delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
    Leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);
  if (
    center === null ||
    center[0] === undefined ||
    center[1] === undefined ||
    Number.isNaN(center[0]) ||
    Number.isNaN(center[1])
  ) {
    return null;
  }
  return (
    <div className='map' tw='h-full mx-auto m-0 p-0'>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <ChangeView center={center} zoom={zoom} />
        <DraggableMarker center={center} dragend={dragend} />
      </MapContainer>
    </div>
  );
};

export default StaticMap;
