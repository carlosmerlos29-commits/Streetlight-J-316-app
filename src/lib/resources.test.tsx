import { render } from '@testing-library/react';
import { resources } from './resources.tsx';

describe('allResources', () => {
  it('should render without errors', () => {
    resources.forEach((resource) => {
      render(resource.content);
    });
  });
});
