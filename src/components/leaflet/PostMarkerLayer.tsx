import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractMarkerLayer from './AbstractMarkerLayer';

interface AbstractFireDeptProps {
  state?: string;
  city?: string;
}

const PostMarkerLayer = ({ state, city }: AbstractFireDeptProps) => {
  const [url, setUrl] = useState(null);
  const [zoom, setZoom] = useState(4);
  const [markers, setMarkers] = useState([]);
  const { data } = useSWR(url);

  useEffect(() => {
    const params = new URLSearchParams();
    if (state) {
      params.append('state', state);
      setZoom(10);
    }
    if (city) {
      params.append('city', city);
      setZoom(13);
    }
    setUrl('/api/posts?' + params.toString());
  }, [state, city]);

  useEffect(() => {
    if (data) {
      const newMarkers = data
        .filter((marker) => {
          return marker.latitude && marker.longitude;
        })
        .map((marker) => {
          return {
            center: [marker.latitude, marker.longitude],
            popupContent: marker.title + ' ' + marker.body,
            id: marker._id ?? Math.random(),
          };
        });
      if (newMarkers.length > 0) {
        setMarkers(newMarkers);
      }
    }
  }, [data]);
  return <AbstractMarkerLayer markers={markers} zoom={zoom} />;
};

export default PostMarkerLayer;
