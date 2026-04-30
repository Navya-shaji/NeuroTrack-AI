import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { encrypt } from "@/lib/auth";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: "Missing Google credential" }, { status: 400 });
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 400 });
    }

    const { email, name, picture, sub: googleId } = payload;

    await connectDB();

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user without a password (OAuth user)
      user = await User.create({
        name: name || "Google User",
        email,
        image: picture,
        googleId, // Optional: if you want to store Google-specific ID
      });
    }

    // Generate our custom JWT
    const token = await encrypt({ id: user._id.toString(), email: user.email });

    const response = NextResponse.json({ 
      message: "Google login successful",
      user: { name: user.name, email: user.email }
    }, { status: 200 });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
