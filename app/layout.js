export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white">
          <div className="container mx-auto flex justify-between">
            <a href="/">🏫 School Tracker</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/leaderboard">Leaderboard</a>
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
