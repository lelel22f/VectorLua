export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false });
  }

  const API_KEY = process.env.LUARMOR_API_KEY;
  const PROJECT_ID = process.env.LUARMOR_PROJECT_ID;

  if (!API_KEY || !PROJECT_ID) {
    return res.status(500).json({ success: false });
  }

  try {
    const response = await fetch(
      `https://api.luarmor.net/v3/projects/${PROJECT_ID}/users`,
      {
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ success: false });
    }

    const users = data.users || [];
    const activeUsers = users.filter(u => u.status === 'active' && !u.banned).length;

    return res.status(200).json({
      success: true,
      activeUsers
    });

  } catch (error) {
    return res.status(500).json({ success: false });
  }
}
