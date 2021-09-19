import { render, screen } from '@testing-library/react';
import DataVisualizer from '../DataVisualizer';

it('renders Data visualizer header', () => {
  render(<DataVisualizer />);
  const headingElement = screen.getByRole("heading", { name: "Data Visualizer" });
  expect(headingElement).toBeInTheDocument();
});
