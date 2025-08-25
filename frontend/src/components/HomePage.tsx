import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-indigo-600">Artiseek</span>
            </a>
          </div>
          <div className="lg:flex lg:flex-1 lg:justify-end">
            <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find Your Spark. Hire an Artisan.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Artiseek is the premier platform for connecting with talented artisans and digital freelancers. Whether you need a handcrafted masterpiece or a stunning digital design, find the perfect professional for your project right here.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link to="/services" className="text-sm font-semibold leading-6 text-gray-900">
                Explore services <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 lg:px-8">
            <p className="text-center text-xs leading-5 text-gray-500">
                &copy; 2025 Artiseek, Inc. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
