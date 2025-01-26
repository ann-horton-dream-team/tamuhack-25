import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export async function PUT(request, { params }) {
    const { id } = await params;
    const { newClerkId: clerkId, newFirstName: first_name, newLastName: last_name, newEmail: email } = await request.json();
    await connectDB();
    await User.findByIdAndUpdate(id, { clerkId, first_name, last_name, email });
    return NextResponse.json({ message: "User Updated" }, { status: 200 });
}

export async function GET(request, { params }) {
    const { id } = await params;
    await connectDB();
    const user = await User.findOne({ _id: id });
    return NextResponse.json({ user }, { status: 200 });
}