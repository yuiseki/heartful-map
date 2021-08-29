import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import { IPostModel } from '~/models/PostModel';
import { PostCardView } from './PostCardView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IPostCategory, postCategories } from '~/lib/constants/postCategories';
import 'twin.macro';

interface IPostsByCategory {
  category: IPostCategory;
  posts: IPostModel[];
}

export const PostsByCategoriesView = ({ posts }: { posts: IPostModel[] }) => {
  const postsByCategories: IPostsByCategory[] = postCategories.map(
    (cat: IPostCategory) => {
      return {
        category: cat,
        posts: posts.filter((post) => {
          return post.category.indexOf(cat.name) >= 0;
        }),
      };
    }
  );
  return (
    <div>
      {postsByCategories.map((postsByCategory) => {
        return (
          <Accordion key={postsByCategory.category.name} elevation={2}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{ backgroundColor: postsByCategory.category.bgColor }}
            >
              <h4 tw='text-3xl flex content-center'>
                <div tw='h-8 w-8 mr-2'>
                  {postsByCategory.category.icon && (
                    <img src={postsByCategory.category.icon} />
                  )}
                </div>
                <div tw='text-white'>
                  {postsByCategory.category.name} {postsByCategory.posts.length}
                  件
                </div>
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
