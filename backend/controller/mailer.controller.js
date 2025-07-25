const sgMail = require("@sendgrid/mail");
const { loguserModel } = require("../model/form.model");
const jwt = require("jsonwebtoken");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send Reset Password Email
exports.sendResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await loguserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const msg = {
      to: email,
      from: "rifamolbrkt@gmail.com",
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link will expire in 15 minutes.</p>`,
    };

    await sgMail.send(msg);
    console.log("✅ Reset link sent:", resetLink);
    res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    console.error("❌ Send reset email failed:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Reset Password WITHOUT ENCRYPTION
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("📩 Token from URL:", token);
    console.log("🔓 Decoded user ID:", decoded.userId);

    const user = await loguserModel.findOne({
      _id: decoded.userId,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.warn("⛔ Token expired or user not found");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // No hashing
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();
    console.log("✅ Password updated successfully for:", user.email);
    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("❌ Error resetting password:", err.message);
    res.status(400).json({ message: "Token expired or invalid" });
  }
};
