export default function SidebarLeft() {
  return (
    <aside className="w-64 p-4 bg-white shadow hidden lg:block">
      <nav className="space-y-2">
        <a href="#" className="block text-gray-700 hover:text-blue-600">Questions</a>
        <a href="#" className="block text-gray-700 hover:text-blue-600">Tags</a>
        <a href="#" className="block text-gray-700 hover:text-blue-600">Users</a>
        <a href="#" className="block text-gray-700 hover:text-blue-600">Badges</a>
      </nav>
    </aside>
  );
}
