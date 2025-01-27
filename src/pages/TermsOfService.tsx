import { useNavigate } from "react-router-dom";

const TermsOfService: React.FC = () => {
    const navigate = useNavigate();

  return (
    <div style={{ textAlign: "left", marginTop: "20px", marginLeft: "20px" }}>
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>Terms of Service</h1>
      <p>By using Challenge App, you agree to the following terms:</p>
      <ul>
        <li>You will not use the app for illegal or harmful activities.</li>
        <li>You agree that we may collect and use your data as described in the Privacy Policy.</li>
        <li>We are not responsible for data loss or service interruptions.</li>
      </ul>
      <h2>Changes to These Terms</h2>
      <p>
        We may update these terms occasionally. Continued use of the app constitutes acceptance of
        the updated terms.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions about these Terms of Service, please email us at
        byron.ux@gmail.com.
      </p>
    </div>
  );
};

export default TermsOfService;
