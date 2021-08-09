/// <reference types="@emotion/react/types/css-prop" />
import React from 'react';
import 'twin.macro';
import Link from 'next/link';
import { Button, Grid } from '@material-ui/core';
import { Layout } from '~/components/Layout';
import { states } from 'detect-location-jp';
import useSWR from 'swr';
import { PostCardView } from '~/components/PostCardView';
import { useSession } from 'next-auth/client';
import dynamic from 'next/dynamic';

const PostMarkerLayer = dynamic(
  () => import('~/components/leaflet/PostMarkerLayer'),
  {
    ssr: false,
  }
);

const UserInfo: React.VFC = () => {
  const { data: me } = useSWR('/api/users/me');

  if (me) {
    return (
      <>
        <h3 tw='text-2xl'>
          ユーザー {me.name}さん ({me.email}) としてログイン中です
        </h3>
        {!me.name && (
          <div tw='my-2'>
            <b>
              <Link href='/settings'>設定画面</Link>
            </b>
            で名前を設定してください。
          </div>
        )}
      </>
    );
  } else {
    return (
      <h3 tw='text-2xl'>
        <b>
          <Link href='/auth/signup'>ユーザー登録</Link>
        </b>
        または
        <b>
          <Link href='/auth/signin'>ログイン</Link>
        </b>
        することで、情報の投稿ができます。
      </h3>
    );
  }
};

export const Page: React.VFC = () => {
  const { data: posts } = useSWR('/api/posts');
  const [session] = useSession();

  return (
    <Layout>
      <h2 tw='text-4xl'>ハートフルマップへようこそ！</h2>
      <UserInfo />
      <p tw='my-2'>都道府県を選択してください。</p>
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
      <h2 tw='text-3xl'>最新情報</h2>
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
        <PostMarkerLayer />
      </div>
      <div tw='my-4'>
        {posts &&
          posts.map((post) => {
            return <PostCardView key={post._id} post={post} />;
          })}
      </div>
    </Layout>
  );
};

export default Page;
