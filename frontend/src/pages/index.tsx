import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

type Props = {
  users: User[];
};

export async function getStaticProps() {
  try {
    const res = await fetch("http://localhost:8080/api/users");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const users = await res.json();
    return {
      props: {
        users,
      },
      revalidate: 60 * 60 * 24, // 24 hours
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return {
      props: {
        users: [],
      },
      revalidate: 60, // Retry after 1 minute if failed
    };
  }
}

export default function Home({ users }: Props) {
  if (!users || users.length === 0) {
    return <div>No users available.</div>;
  }

  return (
    <>
      <div className={styles.homeContainer}>
        <h2>User List</h2>
        <Link href="/createUser" className={styles.createButton}>
          Create New Post
        </Link>
        <div>
          {users.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <Link href={`users/${user.id}`} className={styles.postCardBox}>
                <h2>{user.name}</h2>
              </Link>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}