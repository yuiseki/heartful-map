import { Button, Grid, TextField } from '@material-ui/core';
import { getCsrfToken } from 'next-auth/client';
import React, { useCallback, useState } from 'react';
import { Layout } from '~/components/Layout';
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder';

const Page: React.VFC = ({ csrfToken }: { csrfToken: string }) => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const getCurrentPosition = useCallback(() => {
    const success = async (position) => {
      const coords = position.coords;
      const result = await openReverseGeocoder([
        coords.longitude,
        coords.latitude,
      ]);
      setState(result.prefecture);
      setCity(result.city);
    };
    navigator.geolocation.getCurrentPosition(success);
  }, [setState, setCity]);

  return (
    <Layout>
      <div>
        <form method='post' action='/api/posts'>
          <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
          <Grid container spacing={4} alignItems='center' direction='column'>
            <Grid item>
              <h2>口コミを投稿</h2>
            </Grid>
            <Grid item>
              <TextField
                required
                type='text'
                id='placeState'
                name='placeState'
                label='都道府県'
                variant='outlined'
                placeholder='都道府県'
                value={state}
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
                value={city}
              />
            </Grid>
            <Grid item>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={getCurrentPosition}
              >
                現在地から入力
              </Button>
            </Grid>
            <Grid item>
              <TextField
                required
                type='text'
                id='title'
                name='title'
                label='タイトル'
                variant='outlined'
                placeholder='タイトル'
              />
            </Grid>
            <Grid item>
              <TextField
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
