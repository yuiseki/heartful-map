import { useRouter } from 'next/dist/client/router';
import 'twin.macro';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Layout } from '~/components/Layout';
import { PostCard } from '~/components/PostCard';

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
      <div tw='my-4'>{post && <PostCard key={post._id} post={post} />}</div>
    </Layout>
  );
};

export default Page;
