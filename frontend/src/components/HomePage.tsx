import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Welcome to Artiseek</h1>
      </header>
      <main>
        <section>
          <h2>Find the perfect artist for your project.</h2>
          <p>Or showcase your own skills to the world.</p>
          <Link to="/login"><button>Login</button></Link>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Artiseek</p>
      </footer>
    </div>
  );
};

export default HomePage;
