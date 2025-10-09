import User from "../models/User.js";

// @desc Fetch all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        const users = await User.find().select("-password");
        res.json({ success: true, count: users.length, users });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Update user (name, email, role) - Admin
export const updateUser = async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

        const { id } = req.params;
        const { name, email, isAdmin } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;
        if (typeof isAdmin === "boolean") user.isAdmin = isAdmin;

        const updatedUser = await user.save();
        res.json({ success: true, message: "User updated", user: updatedUser });
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Toggle user status (Active/Blocked) - Admin
export const toggleUserStatus = async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.status = status || (user.status === "Active" ? "Blocked" : "Active");
        await user.save();

        res.json({ success: true, message: "User status updated", status: user.status });
    } catch (error) {
        console.error("Error in toggleUserStatus:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Delete user (Admin only)
export const deleteUser = async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};
