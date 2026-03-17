import * as authService from "./auth.service.js";

export async function signup(req, res) {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: "false", message: err.message });
  }
}

export async function login(req, res) {
  try {
    const user = await authService.login(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: "false", message: err.message });
  }
}
