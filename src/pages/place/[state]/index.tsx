import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import 'twin.macro';
import { Layout } from '~/components/Layout';
import { cities } from 'detect-location-jp';
import {
  Button,
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import Link from 'next/link';
import useSWR from 'swr';
import { useEffect } from 'react';
import { useSession } from 'next-auth/client';
import dynamic from 'next/dynamic';
import { PostsByCategoriesView } from '~/components/PostsByCategoriesView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const PostMarkerLayer = dynamic(
  () => import('~/components/leaflet/PostMarkerLayer'),
  {
    ssr: false,
  }
);

export const Page: React.VFC = () => {
  const router = useRouter();
  const { state } = router.query;
  const [url, setUrl] = useState(null);
  const { data: posts } = useSWR(url);
  const [session] = useSession();

  useEffect(() => {
    const params = new URLSearchParams();
    if (state) {
      params.append('state', state as string);
    }
    setUrl('/api/posts?' + params.toString());
  }, [state]);

  return (
    <Layout>
      <h2 tw='text-3xl'>{state}の情報一覧</h2>
      <p>市区町村を選択してください。</p>
      <div tw='my-4'>
        <Grid container spacing={2}>
          {cities.map((city) => {
            if (city.state_ja !== state) {
              return null;
            }
            return (
              <Grid item key={city.id}>
                <Link href={'/place/' + state + '/' + city.city_ja}>
                  <Button variant='outlined'>{city.city_ja}</Button>
                </Link>
              </Grid>
            );
          })}
        </Grid>

        {/* アイコン */}
        <Grid container spacing={3}>
          <Grid item>
            <a href='#ibasho'>
              <img src='../../../images/map.bn_ibasho.png' />
            </a>
          </Grid>
          <Grid item>
            <a href='#ibasho'>
              <img src='../../../images/map.bn_shokudo.png' />
            </a>
          </Grid>
          <Grid item>
            <a href='#pantori'>
              <img src='../../../images/map.bn_pantori.png' />
            </a>
          </Grid>
          <Grid item>
            <a href='#ibasho'>
              <img src='../../../images/map.bn_gakushu.png' />
            </a>
          </Grid>
          <Grid item>
            <a href='#ibasho'>
              <img src='../../../images/map.bn_hoiku.png' />
            </a>
          </Grid>
          <Grid item>
            <a href='#ibasho'>
              <img src='../../../images/map.bn_sodan.png' />
            </a>
          </Grid>
          <Grid item>
            <a href='#ibasho'>
              <img src='../../../images/map.bn_jiin.png' />
            </a>
          </Grid>
          <Grid item>
            <a href='#ibasho'>
              <img src='../../../images/map.bn_akushu.png' />
            </a>
          </Grid>
        </Grid>
      </div>
      {session && (
        <div tw='my-4'>
          <Link href='/posts/new'>
            <Button variant='outlined' color='primary'>
              情報を投稿
            </Button>
          </Link>
        </div>
      )}
      <div tw='my-4 h-96'>
        <PostMarkerLayer state={state as string} />
      </div>
      <div tw='my-4'>{posts && <PostsByCategoriesView posts={posts} />}</div>

      {/* リスト */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='ibasho-content'
          id='ibasho'
        >
          子どもの居場所・親子の居場所
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText primary='ここにリストが入ります' />
            </ListItem>
            <ListItem>
              <ListItemText primary='ここにリストが入ります' />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='shokudo-content'
          id='shokudo'
        >
          子ども食堂
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText primary='ここにリストが入ります' />
            </ListItem>
            <ListItem>
              <ListItemText primary='ここにリストが入ります' />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='pantori-content'
          id='pantori'
        >
          フードパントリー/フードバンク
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText primary='ここにリストが入ります' />
            </ListItem>
            <ListItem>
              <ListItemText primary='ここにリストが入ります' />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Layout>
  );
};

export default Page;
