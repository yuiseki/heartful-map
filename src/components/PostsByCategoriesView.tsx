import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import { IPostModel } from '~/models/PostModel';
import { PostCardView } from './PostCardView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { postCategories } from '~/lib/constants/postCategories';
import 'twin.macro';

interface IPostsByCategory {
  category: string;
  posts: IPostModel[];
}

export const PostsByCategoriesView = ({ posts }: { posts: IPostModel[] }) => {
  const postsByCategories: IPostsByCategory[] = postCategories.map((cat) => {
    return {
      category: cat,
      posts: posts.filter((post) => {
        return post.category.indexOf(cat) >= 0;
      }),
    };
  });
  return (
    <div>
      {postsByCategories.map((postsByCategory) => {
        return (
          <Accordion key={postsByCategory.category} elevation={2}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h4 tw='text-3xl'>
                {postsByCategory.category} {postsByCategory.posts.length}件
              </h4>
            </AccordionSummary>
            <AccordionDetails>
              <div tw='w-full'>
                {postsByCategory.posts.map((post) => {
                  return <PostCardView key={post._id} post={post} />;
                })}
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};
