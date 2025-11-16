import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3>About This App</h3>
        </div>
        <div className="card-body">
          <h5 className="card-title">Created by Jason Pacheco (The Boss)</h5>
          <p className="card-text">
            This application is a Next.js port of the CST-391 React Music App.
            It demonstrates both client-side rendering (CSR) for album search
            and server-side rendering (SSR) for this About page.
          </p>

          <p className="card-text">
            Bootstrap card example adapted from:
            <a
              href="https://getbootstrap.com/docs/5.3/components/card/"
              target="_blank"
              className="ms-2"
            >
              Bootstrap Documentation
            </a>
          </p>

          <Link href="/" className="btn btn-primary mt-3">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
