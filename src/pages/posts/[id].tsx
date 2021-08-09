import { useRouter } from 'next/dist/client/router';
import 'twin.macro';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Layout } from '~/components/Layout';
import { PostCard } from '~/components/PostCard';
import dynamic from 'next/dynamic';

const StaticMap = dynamic(() => import('~/components/leaflet/StaticMap'), {
  ssr: false,
});

export const Page: React.VFC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [url, setUrl] = useState(null);
  const { data: post } = useSWR(url);

  useEffect(() => {
    setUrl('/api/posts/' + id);
  }, [id]);

  return (
    <Layout>
      {post && (
        <>
          <div tw='my-4 h-96'>
            <StaticMap center={[post.latitude, post.longitude]} zoom={18} />
          </div>
          <div tw='my-4'>{post && <PostCard key={post._id} post={post} />}</div>
        </>
      )}
    </Layout>
  );
};

export default Page;
