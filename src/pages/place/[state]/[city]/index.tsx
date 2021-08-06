import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { Layout } from '~/components/Layout';

export const Page: React.VFC = () => {
  const router = useRouter();
  const { state, city } = router.query;

  return (
    <Layout>
      <h1>
        {state}, {city}
      </h1>
    </Layout>
  );
};

export default Page;
