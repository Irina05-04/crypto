import {PortfolioTable} from './portfolio-table';
import type { Meta, StoryObj } from '@storybook/react';
import './portfolio-table.scss';

const meta: Meta<typeof PortfolioTable> = {
  title: 'PortfolioTable',
  component: PortfolioTable,
};

export default meta;
type Story = StoryObj<typeof PortfolioTable>;

export const Default: Story = {
  args: {
    childrens: [{name: 'bitcoin', amount: 5}, {name: 'dogecoin', amount: 1.1}] 
  },
};
