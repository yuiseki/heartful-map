import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { Layout } from '~/components/Layout';
import { cities } from 'detect-location-jp';
import { Link, List, ListItem } from '@material-ui/core';
import NextLink from 'next/link';

export const Page: React.VFC = () => {
  const router = useRouter();
  const { state } = router.query;

  return (
    <Layout>
      <List>
        {cities.map((city) => {
          if (city.state_ja !== state) {
            return null;
          }
          return (
            <ListItem key={Math.random()}>
              <Link>
                <NextLink href={'/place/' + state + '/' + city.city_ja}>
                  {city.city_ja}
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
