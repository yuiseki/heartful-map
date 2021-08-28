import { Button } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useRouter } from 'next/dist/client/router';
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder';

export const CurrentLocationButton = () => {
  const router = useRouter();
  // ブラウザに位置情報を要求する関数
  const getCurrentPosition = useCallback(() => {
    const success = async (position) => {
      const coords = position.coords;
      const result = await openReverseGeocoder([
        coords.longitude,
        coords.latitude,
      ]);
      console.info('openReverseGeocoder', result);
      const path = '/place/' + result.prefecture + '/' + result.city;
      console.info('path', path);
      router.push(path);
    };
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  return (
    <Button
      type='button'
      variant='contained'
      color='primary'
      onClick={getCurrentPosition}
    >
      現在地に移動
    </Button>
  );
};
