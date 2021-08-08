import { useRouter } from 'next/dist/client/router';
import 'twin.macro';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Layout } from '~/components/Layout';
import { PostCard } from '~/components/PostCard';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { Button } from '@material-ui/core';

export const Page: React.VFC = () => {
  const router = useRouter();
  const { state, city } = router.query;
  const [url, setUrl] = useState(null);
  const { data: posts } = useSWR(url);
  const [session] = useSession();

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
        {state}, {city}の口コミ一覧
      </h2>
      {session && (
        <div tw='my-4'>
          <Link href='/recipes/new'>
            <Button variant='outlined' color='primary'>
              口コミを投稿
            </Button>
          </Link>
        </div>
      )}
      <div tw='my-4'>
        {posts &&
          posts.map((post) => {
            return <PostCard key={post._id} post={post} />;
          })}
      </div>
    </Layout>
  );
};

export default Page;
