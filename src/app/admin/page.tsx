import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    // High security check: Only ADMIN role can access
    if (!session || (session.user as any)?.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="section-container" style={{ paddingTop: '2rem' }}>
            <h1 className="section-title">Secure Admin Dashboard</h1>
            <AdminDashboard />
        </div>
    );
}
