import { Tab, Tabs } from '@material-ui/core';
import React, { useState } from 'react';

export const MainCategoryTabs = () => {
  const [tab, setTab] = useState(1);

  const handleTabChange = (_event, newValue) => {
    setTab(newValue);
  };
  return (
    <Tabs
      value={tab}
      variant='scrollable'
      indicatorColor='primary'
      textColor='primary'
      onChange={handleTabChange}
    >
      <Tab label='生活の応援' style={{ minWidth: 20 }} />
      <Tab label='手当と助成金' style={{ minWidth: 20 }} />
      <Tab label='保育・託児' style={{ minWidth: 20 }} />
      <Tab label='習い事の応援' style={{ minWidth: 20 }} />
      <Tab label='食の応援' style={{ minWidth: 20 }} />
      <Tab label='相談の応援' style={{ minWidth: 20 }} />
      <Tab label='住まいの応援' style={{ minWidth: 20 }} />
      <Tab label='イベント' style={{ minWidth: 20 }} />
      <Tab label='お仕事事情' style={{ minWidth: 20 }} />
      <Tab label='コロナ支援' style={{ minWidth: 20 }} />
    </Tabs>
  );
};
