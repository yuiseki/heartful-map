import React from 'react';
import { getCsrfToken, useSession } from 'next-auth/client';
import { Grid, Button, TextField, Link } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import { Layout } from '~/components/Layout';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import 'twin.macro';

export default function SignIn({ csrfToken }: { csrfToken: string }) {
  const [session] = useSession();
  const router = useRouter();
  const { error } = router.query;
  const { signup } = router.query;

  if (session) return <>ログイン済みです</>;

  return (
    <Layout>
      <form method='post' action='/api/auth/callback/credentials'>
        <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
        <Grid container spacing={4} alignItems='center' direction='column'>
          {error && (
            <Grid item tw='text-red-500'>
              メールアドレスまたはパスワードが間違っています
            </Grid>
          )}
          {signup && (
            <Grid item tw='text-green-500'>
              ユーザー登録に成功しました。ログインしてください
            </Grid>
          )}
          <Grid item>
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <EmailIcon />
              </Grid>
              <Grid item>
                <TextField
                  type='email'
                  id='email'
                  name='email'
                  required
                  label='メールアドレス'
                  variant='outlined'
                  placeholder='example@example.com'
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <LockIcon />
              </Grid>
              <Grid item>
                <TextField
                  type='password'
                  id='password'
                  name='password'
                  required
                  label='パスワード'
                  variant='outlined'
                  placeholder='********'
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button type='submit' variant='contained' color='primary'>
              ログイン
            </Button>
          </Grid>
          <Grid item>
            <Link>
              <NextLink href='/auth/signup'>ユーザー登録</NextLink>
            </Link>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
