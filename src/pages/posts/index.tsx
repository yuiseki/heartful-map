import { Card, CardContent, CardHeader } from '@material-ui/core';
import useSWR from 'swr';
import 'twin.macro';
import { Layout } from '~/components/Layout';

const Page: React.VFC = () => {
  const { data: posts } = useSWR('/api/posts');

  return (
    <Layout>
      {posts &&
        posts.map((post) => {
          return (
            <Card key={post.id} elevation={2} tw='my-5'>
              <CardHeader title={post.title} />
              <CardContent>
                <div>{post.placeState}</div>
                <div>{post.placeCity}</div>
                <div>{post.body}</div>
              </CardContent>
            </Card>
          );
        })}
    </Layout>
  );
};

export default Page;
