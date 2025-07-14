export async function POST(req) {
  const { email } = await req.json();
  // Normally send email with reset link here
  return Response.json({ message: `Reset link sent to ${email}` });
}
