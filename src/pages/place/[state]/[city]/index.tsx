import { useRouter } from 'next/dist/client/router';
import 'twin.macro';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Layout } from '~/components/Layout';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { Button, Tab, Tabs } from '@material-ui/core';
import dynamic from 'next/dynamic';
import { PostsByCategoriesView } from '~/components/PostsByCategoriesView';

const PostMarkerLayer = dynamic(
  () => import('~/components/leaflet/PostMarkerLayer'),
  {
    ssr: false,
  }
);

export const Page: React.VFC = () => {
  const router = useRouter();
  const { state, city } = router.query;
  const [url, setUrl] = useState(null);
  const { data: posts } = useSWR(url);
  const [session] = useSession();

  const [tab, setTab] = useState(1);

  const handleTabChange = (_event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (state) {
      params.append('state', state as string);
    }
    if (city) {
      params.append('city', city as string);
    }
    setUrl('/api/posts?' + params.toString());
  }, [state, city]);

  return (
    <Layout>
      <h2 tw='text-3xl'>
        {state}, {city}の情報一覧
      </h2>
      {session && (
        <div tw='my-4'>
          <Link href='/posts/new'>
            <Button variant='outlined' color='primary'>
              情報を投稿
            </Button>
          </Link>
        </div>
      )}
      <Tabs
        value={tab}
        variant='scrollable'
        indicatorColor='primary'
        textColor='primary'
        onChange={handleTabChange}
      >
        <Tab label='生活の応援' style={{ minWidth: 20 }} />
        <Tab label='手当と助成金' style={{ minWidth: 20 }} />
        <Tab label='保育・託児' style={{ minWidth: 20 }} />
        <Tab label='習い事の応援' style={{ minWidth: 20 }} />
        <Tab label='食の応援' style={{ minWidth: 20 }} />
        <Tab label='相談の応援' style={{ minWidth: 20 }} />
        <Tab label='住まいの応援' style={{ minWidth: 20 }} />
        <Tab label='イベント' style={{ minWidth: 20 }} />
        <Tab label='お仕事事情' style={{ minWidth: 20 }} />
        <Tab label='コロナ支援' style={{ minWidth: 20 }} />
      </Tabs>
      <div tw='my-4 h-96'>
        <PostMarkerLayer state={state as string} city={city as string} />
      </div>
      <div tw='my-4'>{posts && <PostsByCategoriesView posts={posts} />}</div>
    </Layout>
  );
};

export default Page;
