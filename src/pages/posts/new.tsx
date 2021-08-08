import { Button, Grid, TextField } from '@material-ui/core';
import 'twin.macro';
import { getCsrfToken } from 'next-auth/client';
import { LatLngTuple } from 'leaflet';
import React, { useCallback } from 'react';
import { Layout } from '~/components/Layout';
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder';
import { useState } from 'react';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const MarkerInput = dynamic(() => import('~/components/leaflet/MarkerInput'), {
  ssr: false,
});

const Page: React.VFC = ({ csrfToken }: { csrfToken: string }) => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState<LatLngTuple>([35.68945, 139.691774]);

  // 住所が変化したらGPS座標を取得しcenterを更新する
  useEffect(() => {
    window.getLatLng(address, (latlng) => {
      console.info('getLatLng', address, latlng);
      setCenter([parseFloat(latlng.lat), parseFloat(latlng.lng)]);
    });
  }, [address]);

  // centerが変化したら都道府県・市区町村を自動で更新する
  useEffect(() => {
    const f = async () => {
      try {
        if (
          center === null ||
          center[0] === undefined ||
          center[1] === undefined ||
          Number.isNaN(center[0]) ||
          Number.isNaN(center[1])
        ) {
          return;
        }
        console.info('openReverseGeocoder', [center[1], center[0]]);
        const result = await openReverseGeocoder([center[1], center[0]]);
        console.info('openReverseGeocoder', result.city);
        setState(result.prefecture);
        setCity(result.city);
      } catch (err) {
        console.error(err);
      }
    };
    f();
  }, center);

  // ブラウザに位置情報を要求する関数
  const getCurrentPosition = useCallback(() => {
    const success = async (position) => {
      const coords = position.coords;
      setCenter([coords.latitude, coords.longitude]);
      const result = await openReverseGeocoder([
        coords.longitude,
        coords.latitude,
      ]);
      console.info('openReverseGeocoder', result);
      setState(result.prefecture);
      setCity(result.city);
      setAddress(result.prefecture + result.city);
    };
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  return (
    <Layout>
      <div>
        <form method='post' action='/api/posts'>
          <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
          <Grid container spacing={2} direction='column' tw='w-full'>
            <Grid item>
              <h2 tw='text-4xl'>口コミを投稿</h2>
            </Grid>
            <Grid item>
              <h3 tw='text-2xl'>位置情報</h3>
            </Grid>
            <Grid item>
              <Button
                type='button'
                variant='outlined'
                color='primary'
                onClick={getCurrentPosition}
              >
                現在地から入力
              </Button>
            </Grid>
            <Grid item xs={10}>
              <TextField
                fullWidth
                required
                type='text'
                id='address'
                name='address'
                label='住所'
                variant='outlined'
                placeholder='住所'
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={10}>
              <Grid container spacing={2} direction='row'>
                <Grid item>
                  <TextField
                    required
                    type='text'
                    id='placeState'
                    name='placeState'
                    label='都道府県'
                    variant='outlined'
                    placeholder='都道府県'
                    defaultValue={state}
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    type='text'
                    id='placeCity'
                    name='placeCity'
                    label='市区町村'
                    variant='outlined'
                    placeholder='市区町村'
                    defaultValue={city}
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={10}>
              <b>
                マーカーを正確な位置にドラッグ・アンド・ドロップしてください
              </b>
              <div tw='h-96'>
                <MarkerInput
                  zoom={16}
                  center={center}
                  dragend={(latlng) => {
                    console.info('dragend', latlng);
                    setCenter([latlng.lat, latlng.lng]);
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={10}>
              <Grid container spacing={2} direction='row'>
                <Grid item>
                  <TextField
                    required
                    type='text'
                    id='latitude'
                    name='latitude'
                    label='latitude'
                    variant='outlined'
                    placeholder='latitude'
                    defaultValue={center[0]}
                    value={center[0]}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    type='text'
                    id='longitude'
                    name='longitude'
                    label='longitude'
                    variant='outlined'
                    placeholder='longitude'
                    defaultValue={center[1]}
                    value={center[1]}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={10}>
              <TextField
                fullWidth
                required
                type='text'
                id='title'
                name='title'
                label='タイトル'
                variant='outlined'
                placeholder='タイトル'
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                fullWidth
                required
                type='text'
                id='body'
                name='body'
                multiline
                rows={10}
                label='本文'
                variant='outlined'
                placeholder='本文'
              />
            </Grid>
            <Grid item>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={false}
              >
                投稿
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Layout>
  );
};

export default Page;

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
