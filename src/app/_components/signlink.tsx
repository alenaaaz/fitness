import Link from "next/link";
// import "~/styles/globals.css";
export function SigninLink() {
    return (
        <Link href="/api/auth/signin" className="btn">
            Sign in
        </Link>
    );
}