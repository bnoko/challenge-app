import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

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
      <h1>Welcome, {userName}!</h1>
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
