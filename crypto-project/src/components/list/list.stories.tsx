import {List} from './list';
import type { Meta, StoryObj } from '@storybook/react';
import { data } from './dataList';

import './list.scss';

const meta: Meta<typeof List> = {
  title: 'List',
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const Default: Story = {
  args: {
    childrens: data
  },
};
