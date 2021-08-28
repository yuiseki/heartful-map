import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
} from '@material-ui/core';
import 'twin.macro';
import { getCsrfToken } from 'next-auth/client';
import { LatLngTuple } from 'leaflet';
import React, { useCallback } from 'react';
import { Layout } from '~/components/Layout';
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder';
import { useState } from 'react';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { postCategories } from '~/lib/constants/postCategories';

const MarkerInput = dynamic(() => import('~/components/leaflet/MarkerInput'), {
  ssr: false,
});

const Page: React.VFC = ({ csrfToken }: { csrfToken: string }) => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState<LatLngTuple>([35.68945, 139.691774]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      if (selectedCategories.indexOf(event.target.value) < 0) {
        setSelectedCategories([...selectedCategories, event.target.value]);
      }
    } else {
      if (selectedCategories.indexOf(event.target.value) >= 0) {
        const arr = [...selectedCategories];
        arr.splice(arr.indexOf(event.target.value), 1);
        setSelectedCategories(arr);
      }
    }
  };

  const error = selectedCategories.length < 1;

  // 住所が変化したらGPS座標を取得しcenterを更新する
  useEffect(() => {
    // @ts-ignore
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
              <h2 tw='text-4xl'>情報を投稿</h2>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type='text'
                id='title'
                name='title'
                label='名称'
                variant='outlined'
                placeholder='名称'
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl required error={error} component='fieldset'>
                <FormLabel component='legend'>カテゴリー</FormLabel>
                <FormGroup>
                  {postCategories.map((cat) => {
                    return (
                      <FormControlLabel
                        key={cat.name}
                        control={
                          <Checkbox
                            checked={selectedCategories.indexOf(cat) >= 0}
                            onChange={handleCategoryChange}
                            name='category[]'
                            value={cat}
                          />
                        }
                        label={cat}
                      />
                    );
                  })}
                </FormGroup>
                {error && (
                  <FormHelperText>
                    カテゴリーを1つ以上選んでください
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type='text'
                id='body'
                name='body'
                multiline
                rows={15}
                label='本文'
                variant='outlined'
                placeholder='本文'
              />
            </Grid>
            <Grid item>
              <h3 tw='text-2xl'>連絡方法</h3>
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                type='email'
                id='email'
                name='email'
                label='メールアドレス'
                variant='outlined'
                placeholder='example@example.com'
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                type='tel'
                id='tel'
                name='tel'
                label='電話番号'
                variant='outlined'
                placeholder='03-0000-0000'
              />
            </Grid>
            <Grid item>
              <h3 tw='text-2xl'>URL</h3>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type='url'
                id='url'
                name='url'
                label='ホームページのURL'
                variant='outlined'
                placeholder='https://'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='url'
                id='twitter'
                name='twitter'
                label='TwitterのURL'
                variant='outlined'
                placeholder='https://twitter.com/'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='url'
                id='instagram'
                name='instagram'
                label='InstagramのURL'
                variant='outlined'
                placeholder='https://instagram.com/'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='url'
                id='facebook'
                name='facebook'
                label='FacebookのURL'
                variant='outlined'
                placeholder='https://facebook.com/'
              />
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Grid container spacing={2} direction='row'>
                <Grid item>
                  <TextField
                    required
                    type='text'
                    id='placeState'
                    name='placeState'
                    label='都道府県'
                    variant='filled'
                    placeholder='都道府県'
                    defaultValue={state}
                    value={state}
                    InputProps={{
                      readOnly: true,
                    }}
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
                    variant='filled'
                    placeholder='市区町村'
                    defaultValue={city}
                    value={city}
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <h4 tw='text-xl'>GPS座標</h4>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} direction='row'>
                <Grid item>
                  <TextField
                    required
                    type='text'
                    id='latitude'
                    name='latitude'
                    label='latitude'
                    variant='filled'
                    placeholder='latitude'
                    defaultValue={center[0]}
                    value={center[0]}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    type='text'
                    id='longitude'
                    name='longitude'
                    label='longitude'
                    variant='filled'
                    placeholder='longitude'
                    defaultValue={center[1]}
                    value={center[1]}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <b>
                マーカーを正確な位置にドラッグ・アンド・ドロップしてください
              </b>
              <div style={{ height: '600px' }}>
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
