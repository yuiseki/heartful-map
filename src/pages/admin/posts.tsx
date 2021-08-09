import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
  Button,
  IconButton,
} from '@material-ui/core';
import { getSession } from 'next-auth/client';
import Link from 'next/link';
import React, { useState } from 'react';
import useSWR from 'swr';
import 'twin.macro';
import { Layout } from '~/components/Layout';
import { dbConnect } from '~/lib/dbConnect';
import { IPostModel } from '~/models/PostModel';
import { UserModel } from '~/models/UserModel';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useCallback } from 'react';

const Row = ({ post }: { post: IPostModel }) => {
  const [open, setOpen] = useState(false);

  const confirmPost = useCallback(() => {
    const f = async () => {
      await fetch('/api/posts/' + post._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmed: true,
        }),
      });
      window.location.reload();
    };
    f();
  }, []);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{post.draft ? '下書き' : ''}</TableCell>
        <TableCell>
          {post.confirmed ? (
            <div>
              <div tw='text-align[center] text-green-400'>確認済み</div>
            </div>
          ) : (
            <div>
              <div tw='text-align[center] text-yellow-600 my-2'>未確認</div>
              <Button
                fullWidth
                variant='outlined'
                color='primary'
                onClick={confirmPost}
              >
                確認した
              </Button>
            </div>
          )}
        </TableCell>
        <TableCell>{post.title}</TableCell>
        <TableCell>{post.category.join(', ')}</TableCell>
        <TableCell>{post.placeState}</TableCell>
        <TableCell>{post.placeCity}</TableCell>
        <TableCell>{post.address}</TableCell>
        <TableCell>{post.body.length}文字</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <pre>{post.body}</pre>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const Page: React.VFC = () => {
  const { data: me } = useSWR('/api/users/me');
  const { data: posts } = useSWR('/api/posts');
  return (
    <Layout>
      <h2 tw='text-4xl'>ハートフルマップ 投稿管理画面</h2>
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
              <TableCell>
                <b>本文</b>
              </TableCell>
              <TableCell>
                <b>下書き？</b>
              </TableCell>
              <TableCell>
                <b>確認済み？</b>
              </TableCell>
              <TableCell>
                <b>名称</b>
              </TableCell>
              <TableCell>
                <b>カテゴリー</b>
              </TableCell>
              <TableCell>
                <b>都道府県</b>
              </TableCell>
              <TableCell>
                <b>市区町村</b>
              </TableCell>
              <TableCell>
                <b>住所</b>
              </TableCell>
              <TableCell>
                <b>本文文字数</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts &&
              posts.map((post) => {
                return <Row key={post._id} post={post} />;
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
