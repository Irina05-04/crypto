import {Button} from './button';
import type { Meta, StoryObj } from '@storybook/react';
import './button.scss';


const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Click",
    variant: "color",
    view: "square",
    size: "large",
  },
};
export const Square: Story = {
  args: {
    children: "Click",
    variant: "color",
    view: "square",
    size: "large",
  },
};
export const Round: Story = {
  args: {
    children: `+`,
    variant: 'color',
    view: 'round',
    size: 'round-size',
  },
};
export const WithoutBack: Story = {
  args: {
    children: `+`,
    variant: "transparent",
    view: "round",
    size: "round-size",
  },
};
export const Disabled: Story = {
  args: {
    children: `Click`,
    variant: "color",
    view: "square",
    size: "large",
    disabled: true,
  },
};