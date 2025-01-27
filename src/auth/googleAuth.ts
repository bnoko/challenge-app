// Import the Supabase client
import { supabase } from '../supabase';

// Define the structure of the Google Credential Response
interface CredentialResponse {
  credential: string; // ID token provided by Google Sign-In
}

/**
 * Handles Google Sign-In by:
 * - Authenticating the user with Supabase
 * - Saving/updating user data in the 'users' database
 * - Redirecting the user to /home after successful sign-in
 * 
 * @param response - The Google Credential Response
 */
export async function handleSignInWithGoogle(response: CredentialResponse): Promise<void> {
  try {
    // Authenticate the user with Supabase using the ID token from Google
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    });

    // Handle authentication errors
    if (error) {
      console.error('Error during Google sign-in:', error.message);
      alert('Sign-in failed. Please try again.');
      return;
    }

    // Extract the authenticated user's data
    const user = data.user;
    if (!user) {
      console.error('No user data returned from Supabase.');
      alert('Sign-in failed. Please try again.');
      return;
    }

    console.log('User signed in:', user);

    // Save or update the user's information in the 'users' database
    const { error: upsertError } = await supabase.from('users').upsert({
      id: user.id, // Supabase Auth user ID (primary key)
      email: user.email, // User's email address
      full_name: user.user_metadata.full_name, // User's full name from Google
      avatar_url: user.user_metadata.avatar_url, // User's Google profile picture
      last_sign_in: new Date().toISOString(), // Record the sign-in timestamp
    });

    // Handle errors during the database upsert
    if (upsertError) {
      console.error('Error saving user data to the database:', upsertError.message);
      alert('An error occurred while saving your account details. Please try again.');
      return;
    }

    console.log('User data saved/updated successfully.');

    // Redirect the user to the /home page
    window.location.href = '/home'; // You can replace this with useNavigate if used in a React component
  } catch (err: any) {
    // Handle unexpected errors
    console.error('Unexpected error during Google sign-in:', err.message);
    alert('An unexpected error occurred. Please try again.');
  }
}
