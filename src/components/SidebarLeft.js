import Link from 'next/link';

export default function SidebarLeft() {
  return (
    <aside className="w-64 p-4 bg-white shadow hidden lg:block">
      <nav className="space-y-2">
        <Link href="/questions" className="block text-gray-700 hover:text-blue-600">Questions</Link>
        <Link href="/tags" className="block text-gray-700 hover:text-blue-600">Tags</Link>
        <Link href="/users" className="block text-gray-700 hover:text-blue-600">Users</Link>
        <Link href="/badges" className="block text-gray-700 hover:text-blue-600">Badges</Link>
      </nav>
    </aside>
  );
}
