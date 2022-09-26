import Link from 'next/link';

export default function Home() {
  return (
    <Link href="/test/12345" as="/test/12345">
        <a>test with ID</a>
    </Link>
  );
}
