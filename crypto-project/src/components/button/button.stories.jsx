import {Button} from './button';
import './button.scss';

export default {
    title: 'Button',
    component: Button,
    argTypes: {
        variant: {
            descrition: 'button view',
            defaultValue: 'square',
        },
        size: {
            descrition: 'size button',
            defaultValue: 'large'
        },
        disabled: {
            descrition: 'disabled button',
            defaultValue: 'false'
        }
    },
}


const Template = args => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Click',
  variant: 'color',
  view: 'square',
  size: 'large'
};

export const Square = Template.bind({});
Square.args = {
  children: 'Click',
  variant: 'color',
  view: 'square',
  size: 'large'
};

export const Round = Template.bind({});
Round.args = {
  children: `+`,
  variant: 'color',
  view: 'round',
  size: 'round-size',
};

export const WithoutBack = Template.bind({});
WithoutBack.args = {
  children: `+`,
  variant: 'transparent',
  view: 'round',
  size: 'round-size'
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: `Click`,
  variant: 'color',
  view: 'square',
  size: 'large',
  disabled: true
};

export const Small = Template.bind({});
Small.args = {
  children: `Click`,
  variant: 'color',
  view: 'square',
  size: 'small',
};

export const Large = Template.bind({});
Large.args = {
  children: `Click`,
  variant: 'color',
  view: 'square',
  size: 'large',
};