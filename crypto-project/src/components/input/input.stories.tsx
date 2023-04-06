import {Input} from './input';
import type { Meta, StoryObj } from '@storybook/react';
import './input.scss';


const meta: Meta<typeof Input> = {
  title: 'Input',
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    type: 'text',
  },
};
