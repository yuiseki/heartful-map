/// <reference types="@emotion/react/types/css-prop" />
import React from 'react';
import 'twin.macro';
import Link from 'next/link';
import { Button, Grid } from '@material-ui/core';
import { Layout } from '~/components/Layout';
import { states } from 'detect-location-jp';
import useSWR from 'swr';
import { PostCard } from '~/components/PostCard';
import { useSession } from 'next-auth/client';

const UserInfo: React.VFC = () => {
  const { data: me } = useSWR('/api/users/me');

  if (me) {
    return (
      <p>
        <b>
          {me.name}さん ({me.email})
        </b>
        としてログイン中です
      </p>
    );
  } else {
    return (
      <p>
        <b>
          <Link href='/auth/signup'>ユーザー登録</Link>
        </b>
        または
        <b>
          <Link href='/auth/signin'>ログイン</Link>
        </b>
        することで、口コミの投稿ができます。
      </p>
    );
  }
};

export const Page: React.VFC = () => {
  const { data: posts } = useSWR('/api/posts');
  const [session] = useSession();

  return (
    <Layout>
      <h2 tw='text-3xl'>ハートフルマップへようこそ！</h2>
      <UserInfo />
      <p>都道府県を選択してください。</p>
      <div tw='my-4'>
        <Grid container spacing={2}>
          {states
            .sort((a, b) => {
              return parseInt(a.code) - parseInt(b.code);
            })
            .map((state) => {
              return (
                <Grid item key={state.id}>
                  <Link href={'/place/' + state.state_ja}>
                    <Button variant='outlined'>
                      {state.code + ' ' + state.state_ja}
                    </Button>
                  </Link>
                </Grid>
              );
            })}
        </Grid>
      </div>
      <h2 tw='text-3xl'>最新口コミ</h2>
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
