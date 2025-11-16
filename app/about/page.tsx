import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3>About Box</h3>
        </div>
        <div className="card-body">
          <h5 className="card-title">Created by Jason Pacheco - Boss</h5>
          <Link href="/" className="btn btn-primary mt-3">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
