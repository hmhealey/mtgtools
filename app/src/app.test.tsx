import {render, screen} from '@testing-library/react';
import React from 'react';

import App from './app';

test('renders submit button', () => {
    render(<App />);
    const submitElement = screen.getByText(/Get Card/i);
    expect(submitElement).toBeInTheDocument();
});
