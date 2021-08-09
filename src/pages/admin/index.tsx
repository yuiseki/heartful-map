import { Grid } from '@material-ui/core';
import { getSession } from 'next-auth/client';
import Link from 'next/link';
import React from 'react';
import useSWR from 'swr';
import 'twin.macro';
import { Layout } from '~/components/Layout';
import { dbConnect } from '~/lib/dbConnect';
import { UserModel } from '~/models/UserModel';
import GroupIcon from '@material-ui/icons/Group';
import ListAltIcon from '@material-ui/icons/ListAlt';

export const Page: React.VFC = () => {
  const { data: me } = useSWR('/api/users/me');
  return (
    <Layout>
      <h2 tw='text-4xl'>ハートフルマップ 管理画面</h2>
      {me && (
        <h3 tw='text-2xl'>
          管理者 {me.name}さん ({me.email}) としてログイン中です
        </h3>
      )}
      <div tw='my-4'>
        <Grid container direction='column' spacing={4}>
          <Grid item>
            <Link href='/admin/users' passHref>
              <a tw='text-2xl text-blue-400'>
                <GroupIcon fontSize='large' />
                ユーザー管理画面
              </a>
            </Link>
          </Grid>
          <Grid item>
            <Link href='/admin/posts' passHref>
              <a tw='text-2xl text-blue-400'>
                <ListAltIcon fontSize='large' />
                投稿管理画面
              </a>
            </Link>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    context.res.writeHead(302, { Location: '/' });
    context.res.end();
    return { props: {} };
  }

  await dbConnect();
  const user = await UserModel.findOne({ email: session.user.email });
  if (!user) {
    context.res.status(401).json({ error: 'Unauthorized, User not found.' });
    context.res.end();
    return { props: {} };
  }
  if (!user.isAdmin) {
    context.res.status(401).json({ error: 'Unauthorized, User is not admin.' });
    context.res.end();
    return { props: {} };
  }

  return {
    props: {
      session: session,
    },
  };
}

export default Page;
