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
import { LatLngTuple } from 'leaflet';
import React, { useCallback } from 'react';
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder';
import { useState } from 'react';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { postCategories } from '~/lib/constants/postCategories';
import { IPostModel } from '~/models/PostModel';
import { useRouter } from 'next/dist/client/router';

const MarkerInput = dynamic(() => import('~/components/leaflet/MarkerInput'), {
  ssr: false,
});

export const PostForm: React.VFC<{
  csrfToken: string;
  post?: IPostModel;
  title?: string;
  submitLabel?: string;
}> = ({
  csrfToken,
  post = null,
  title = '情報を投稿',
  submitLabel: submitLabel = '投稿',
}: {
  csrfToken: string;
  post: IPostModel;
  title: string;
  submitLabel: string;
}) => {
  const router = useRouter();
  const [state, setState] = useState(post?.placeState || '');
  const [city, setCity] = useState(post?.placeCity || '');
  const [address, setAddress] = useState(post?.address || '');
  const [center, setCenter] = useState<LatLngTuple>([
    post?.latitude || 35.68945,
    post?.longitude || 139.691774,
  ]);

  const [selectedCategories, setSelectedCategories] = useState(
    post?.category || []
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body: any = {};
    formData.forEach((value, key) => (body[key] = value));
    console.info(JSON.stringify(body, null, '  '));

    const headers = {
      'Content-Type': 'application/json',
    };

    if (post) {
      await fetch('/api/posts/' + post._id, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
      });
    } else {
      await fetch('/api/posts', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
    }
    router.push('/');
  };

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

  //<form method='post' action='/api/posts'>
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
        <Grid container spacing={2} direction='column' tw='w-full'>
          <Grid item>
            <h2 tw='text-4xl'>{title}</h2>
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
              defaultValue={post?.title}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl required error={error} component='fieldset'>
              <FormLabel component='legend'>カテゴリー</FormLabel>
              <FormGroup>
                {postCategories.map((cat) => {
                  return (
                    <FormControlLabel
                      key={cat}
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
              defaultValue={post?.body}
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
              defaultValue={post?.email}
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
              defaultValue={post?.tel}
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
              defaultValue={post?.url}
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
              defaultValue={post?.twitter}
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
              defaultValue={post?.instagram}
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
              defaultValue={post?.facebook}
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
            <b>マーカーを正確な位置にドラッグ・アンド・ドロップしてください</b>
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
              {submitLabel}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default PostForm;
