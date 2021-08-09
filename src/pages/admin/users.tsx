import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@material-ui/core';
import { getSession } from 'next-auth/client';
import Link from 'next/link';
import React from 'react';
import { useCallback } from 'react';
import useSWR from 'swr';
import 'twin.macro';
import { Layout } from '~/components/Layout';
import { dbConnect } from '~/lib/dbConnect';
import { IUserModel, UserModel } from '~/models/UserModel';

const Row = ({ user }: { user: IUserModel }) => {
  const { data: me } = useSWR('/api/users/me');
  const toggleUserAdmin = useCallback(() => {
    const f = async () => {
      const res = await fetch('/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAdmin: !user.isAdmin,
        }),
      });
      console.info(res.status);
      if (res.status.toString().indexOf('2') !== 0) {
        const json = await res.json();
        console.info(json);
      } else {
        window.location.reload();
      }
    };
    f();
  }, []);

  return (
    <TableRow>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
      <TableCell>
        {user.loggedInAt ? new Date(user.loggedInAt).toLocaleString() : '不明'}
      </TableCell>
      <TableCell>
        {user.isAdmin ? (
          <div>
            <div tw='text-align[center] text-blue-400 my-2'>管理者</div>
            {user._id !== me._id && (
              <Button
                fullWidth
                variant='outlined'
                color='secondary'
                onClick={toggleUserAdmin}
              >
                管理者解除
              </Button>
            )}
          </div>
        ) : (
          <div>
            <div tw='text-align[center] my-2'>一般ユーザー</div>
            <Button
              fullWidth
              variant='outlined'
              color='primary'
              onClick={toggleUserAdmin}
            >
              管理者にする
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export const Page: React.VFC = () => {
  const { data: me } = useSWR('/api/users/me');
  const { data: users } = useSWR('/api/users');

  return (
    <Layout>
      <h2 tw='text-4xl'>ハートフルマップ ユーザー管理画面</h2>
      {me && (
        <h3 tw='text-2xl'>
          管理者 {me.name}さん ({me.email}) としてログイン中です
        </h3>
      )}
      <div tw='my-4 text-xl text-blue-400'>
        <Link href='/admin'>←管理画面トップに戻る</Link>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>メールアドレス</TableCell>
              <TableCell>名前</TableCell>
              <TableCell>ユーザー登録日</TableCell>
              <TableCell>最終ログイン日</TableCell>
              <TableCell>管理者？</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((user) => {
                return <Row key={user._id} user={user} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
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
