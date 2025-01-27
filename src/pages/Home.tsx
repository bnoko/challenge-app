import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Adjust path to your Supabase client

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
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

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome, {userName}!</h1>
      <button onClick={() => navigate("/sign-in")} style={{ margin: "10px" }}>
        Pretend to log out
      </button>
      <footer style={{ marginTop: '50px' }}>
        <a href="/privacy-policy">Privacy Policy</a> |{' '}
        <a href="/terms-of-service">Terms of Service</a>
      </footer>
    </div>
  );
};

export default Home;
