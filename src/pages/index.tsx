/// <reference types="@emotion/react/types/css-prop" />
import React from 'react';
import 'twin.macro';
import NextLink from 'next/link';
import { Link, List, ListItem, Typography } from '@material-ui/core';
import { Layout } from '~/components/Layout';
import { states } from 'detect-location-jp';

export const Page: React.VFC = () => {
  return (
    <Layout>
      <p>
        <Typography variant='h6'>ハートフルマップへようこそ！</Typography>
      </p>
      <p>
        <Typography variant='h6'>
          <b>
            <NextLink href='/auth/signup'>ユーザー登録</NextLink>
          </b>
          または
          <b>
            <NextLink href='/auth/signin'>ログイン</NextLink>
          </b>
          することで、口コミの投稿ができます。
        </Typography>
      </p>
      <p>
        <Typography variant='h6'>都道府県を選択してください。</Typography>
      </p>
      <List>
        {states
          .sort((a, b) => {
            return parseInt(a.code) - parseInt(b.code);
          })
          .map((state) => {
            return (
              <ListItem key={state.id}>
                <Link>
                  <NextLink href={'/place/' + state.state_ja}>
                    <span>
                      {state.code} {state.state_ja}
                    </span>
                  </NextLink>
                </Link>
              </ListItem>
            );
          })}
      </List>
    </Layout>
  );
};

export default Page;
