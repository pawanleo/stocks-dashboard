import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginView from '../components/LoginView';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  }
}));

import axios from 'axios';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe('LoginView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login form', () => {
    renderWithRouter(<LoginView />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Secure Login')).toBeInTheDocument();
  });

  it('should render email and password inputs', () => {
    renderWithRouter(<LoginView />);
    const emailInput = screen.getByPlaceholderText('you@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('should have default email pre-filled', () => {
    renderWithRouter(<LoginView />);
    const emailInput = screen.getByPlaceholderText('you@email.com') as HTMLInputElement;
    expect(emailInput.value).toBe('demo@groww.in');
  });

  it('should update fields on user input', () => {
    renderWithRouter(<LoginView />);
    const emailInput = screen.getByPlaceholderText('you@email.com') as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    expect(emailInput.value).toBe('test@test.com');
  });

  it('should call the login API on form submit', async () => {
    const mockedPost = vi.mocked(axios.post);
    mockedPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          token: 'mock-token',
          user: { id: 1, email: 'demo@groww.in', name: 'demo' }
        }
      }
    });

    renderWithRouter(<LoginView />);

    const submitButton = screen.getByText('Secure Login');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({ email: 'demo@groww.in' })
      );
    });
  });

  it('should display error message on failed login', async () => {
    const mockedPost = vi.mocked(axios.post);
    mockedPost.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    });

    renderWithRouter(<LoginView />);

    const submitButton = screen.getByText('Secure Login');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should have a link to the signup page', () => {
    renderWithRouter(<LoginView />);
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('should have a return to markets link', () => {
    renderWithRouter(<LoginView />);
    expect(screen.getByText('← Return to live markets')).toBeInTheDocument();
  });
});
