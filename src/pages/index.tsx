/// <reference types="@emotion/react/types/css-prop" />
import React from 'react';
import 'twin.macro';
import NextLink from 'next/link';
import { Link, List, ListItem } from '@material-ui/core';
import { Layout } from '~/components/Layout';
import { states } from 'detect-location-jp';
import { useSession } from 'next-auth/client';

const UserInfo: React.VFC = () => {
  const [session] = useSession();

  if (session) {
    return <p>{session.user.email} としてログイン中です</p>;
  } else {
    return (
      <p>
        <b>
          <NextLink href='/auth/signup'>ユーザー登録</NextLink>
        </b>
        または
        <b>
          <NextLink href='/auth/signin'>ログイン</NextLink>
        </b>
        することで、口コミの投稿ができます。
      </p>
    );
  }
};

export const Page: React.VFC = () => {
  return (
    <Layout>
      <h2>ハートフルマップへようこそ！</h2>
      <UserInfo />
      <p>都道府県を選択してください。</p>
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
                    {state.code + ' ' + state.state_ja}
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
