import { useRouter } from "next/router";
import styles from "../../styles/User.module.css";

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
  user: User;
};

export async function getStaticPaths() {
  const res = await fetch("http://localhost:8080/api/users");
  const users: User[] = await res.json();

  const paths = users.map((user) => ({
    params: { id: user.id.toString() },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`http://localhost:8080/api/users/${params.id}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const user = await res.json();

    return {
      props: {
        user,
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return {
      notFound: true,
    };
  }
}

export default function UserDetail({ user }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{user.name}</h1>
      <div className={styles.details}>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
        <p>Updated At: {new Date(user.updatedAt).toLocaleString()}</p>
      </div>
      {user.avatar && (
        <div className={styles.avatar}>
          <img src={user.avatar} alt={`${user.name}'s avatar`} />
        </div>
      )}
    </div>
  );
}