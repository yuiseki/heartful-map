/// <reference types="@emotion/react/types/css-prop" />
import React from 'react';
import 'twin.macro';
import Link from 'next/link';
import { Typography } from '@material-ui/core';
import { Layout } from '~/components/Layout';

export const Page: React.VFC = () => {
  return (
    <Layout>
      <p>
        <Typography variant='h6'>ハートフルマップへようこそ！</Typography>
      </p>
      <p>
        <Typography variant='h6'>
          <b>
            <Link href='/auth/signup'>ユーザー登録</Link>
          </b>
          または
          <b>
            <Link href='/auth/signin'>ログイン</Link>
          </b>
          することで、口コミの投稿ができます。
        </Typography>
      </p>
      <p>
        <Typography variant='h6'>都道府県を選択してください。</Typography>
      </p>
    </Layout>
  );
};

export default Page;
