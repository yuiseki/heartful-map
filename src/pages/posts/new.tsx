import { getCsrfToken } from 'next-auth/client';
import { Layout } from '~/components/Layout';
import '~/components/PostForm';
import PostForm from '~/components/PostForm';

const New: React.VFC = ({ csrfToken }: { csrfToken: string }) => {
  return (
    <Layout>
      <PostForm csrfToken={csrfToken} />
    </Layout>
  );
};

export default New;
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
