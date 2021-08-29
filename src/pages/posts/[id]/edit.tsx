import { GetServerSideProps } from 'next';
import { getCsrfToken } from 'next-auth/client';
import { Layout } from '~/components/Layout';
import '~/components/PostForm';
import PostForm from '~/components/PostForm';
import { IPostModel, PostModel } from '~/models/PostModel';

const Edit = ({ csrfToken, post }: { csrfToken: string; post: IPostModel }) => {
  return (
    <Layout>
      <PostForm
        csrfToken={csrfToken}
        post={post}
        title='情報を更新'
        submitLabel='更新'
      />
    </Layout>
  );
};

export default Edit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const post = await PostModel.findOne({ _id: id });
  const csrfToken = await getCsrfToken(context);

  return {
    props: {
      csrfToken: csrfToken,
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
