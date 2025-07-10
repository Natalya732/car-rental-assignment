import { users } from "@/shared/utils/mock-data/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, action } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (action === "signup") {
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        return Response.json(
          { error: "User already exists with this email" },
          { status: 409 },
        );
      }

      if (!name) {
        return Response.json(
          { error: "Name is required for signup" },
          { status: 400 },
        );
      }

      const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        authToken: `#${Math.random().toString(36).substr(2, 9)}${Date.now()}`,
      };

      users.push(newUser);

      return Response.json({
        message: "User registered successfully",
        user: {
          id: newUser.id.toString(),
          email: newUser.email,
          name: newUser.name,
          role: "user" as const,
        },
        authToken: newUser.authToken,
      });
    }

    // login here
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return Response.json({
      message: "Login successful",
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.name === "Admin" ? ("admin" as const) : ("user" as const),
      },
      authToken: user.authToken,
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
