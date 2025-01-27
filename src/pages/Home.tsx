import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const [signInStatus, setSignInStatus] = useState<string>("Checking...");


  useEffect(() => {
    // function to get username
    const fetchUserData = async () => {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
        console.error('Error fetching session:', sessionError);
        return;
      }

      const userId = data.session?.user?.id;
      if (!userId) {
        console.error('No user ID found');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        return;
      }

      setUserName(userData?.full_name || 'Guest');
    };
    
    fetchUserData();

    //check sign in status
    const checkSignInStatus = async () => {
        const { data, error } = await supabase.auth.getSession();
  
        if (error) {
            console.error("Error fetching session:", error.message);
            setSignInStatus("Error checking sign-in status");
            return;
          }
      
          if (data.session?.user) {
            setSignInStatus("You're signed in with Google");
          } else {
            setSignInStatus("You're not signed in with Google");
          }
        };
      
      checkSignInStatus();
  
  }, []);

  //function to handle logout process
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      navigate("/sign-in"); // Redirect to the sign-in page after logout
    }
  };
  
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome, {userName}!</h2>
      <p>{signInStatus}</p> {/* Displays the sign-in status */}
      <button onClick={handleLogout} style={{ margin: "10px" }}> Log Out
      </button>
      <footer style={{ marginTop: '50px' }}>
        <a href="/privacy-policy">Privacy Policy</a> |{' '}
        <a href="/terms-of-service">Terms of Service</a>
      </footer>
    </div>
  );
};

export default Home;
