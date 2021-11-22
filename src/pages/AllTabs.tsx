import {
  Title,
  TextInput,
  LoadingOverlay,
  ActionIcon,
  Switch,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Search, Filter } from '@styled-icons/feather';
import { Box, Composition } from 'atomic-layout';
import { Suspense, useState } from 'react';
// import graphql from 'babel-plugin-relay/macro';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { AllTabsListQuery } from './__generated__/AllTabsListQuery.graphql';

import LinkList from '../components/LinkList';

const defaultFilter = { incognito: { _eq: false } };
const defaultCount = 100;

export default function AllTabs() {
  const [incognito, setIncognito] = useState(false);
  const [value, setValue] = useState('');
  const [searchText] = useDebouncedValue(value, 1000);
  const searchFilter = searchText
    ? { title: { _ilike: `%${searchText}%` } }
    : {};
  const filter = {
    ...{ incognito: { _eq: incognito } },
    ...searchFilter,
  };
  const query = useLazyLoadQuery<AllTabsListQuery>(
    graphql`
      query AllTabsListQuery(
        $defaultCount: Int
        $defaultFilter: Link_bool_exp
      ) {
        ...LinkList_connection
          @arguments(count: $defaultCount, filter: $defaultFilter)
      }
    `,
    {
      defaultCount,
      defaultFilter,
    }
  );

  return (
    <Composition
      height="100vh"
      templateRows="auto auto 1fr"
      templateCols="1fr"
      gap={8}
    >
      <Title order={4}>All Tabs</Title>
      <Box flex alignItems="center" style={{ gap: 8 }}>
        <TextInput
          style={{ flexGrow: 1 }}
          icon={<Search size={24} />}
          placeholder="Search"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
        <ActionIcon>
          <Filter strokeWidth={2} />
        </ActionIcon>
        <Switch
          label="Incognito"
          size="md"
          checked={incognito}
          onChange={(event) => setIncognito(event.currentTarget.checked)}
        />
      </Box>

      <Suspense
        fallback={
          <div style={{ position: 'relative' }}>
            <LoadingOverlay
              loaderProps={{ size: 'lg' }}
              overlayOpacity={0.0}
              visible={true}
            />
          </div>
        }
      >
        <LinkList linkConnection={query} filter={filter} count={150} />
      </Suspense>
    </Composition>
  );
}
