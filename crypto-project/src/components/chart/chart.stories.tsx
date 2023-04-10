import {ChartComponent} from './chart';
import type { Meta, StoryObj } from '@storybook/react';
import './chart.scss';


const meta: Meta<typeof ChartComponent> = {
  title: 'Chart',
  component: ChartComponent,
};

export default meta;
type Story = StoryObj<typeof ChartComponent>;

export const Default: Story = {
  args: {
    name: "text",
    history: [
      { priceUsd: "11", time: 1680750182 },
      { priceUsd: "5", time: 1680778982 },
      { priceUsd: "18", time: 1680786182 },
    ],
  },
};
