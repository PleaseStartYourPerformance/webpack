import {Xin__COMPONENT_NAME__} from '../../components';
import Readme from './__COMPONENT_FILENAME__.md';

export default {
  title: '__COMPONENT_NAME__',
  component: Xin__COMPONENT_NAME__,
  parameters: {
    order: __STORIES_ORDER__,
    notes: Readme
  }
};

export const Default = () => ({
  components: {Xin__COMPONENT_NAME__},
  template: `
    <div class="demo-__COMPONENT_CLASS_NAME__">
      <xin-__COMPONENT_TAG_NAME__ />
    </div>
  `
});
